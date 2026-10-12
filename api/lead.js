/**
 * 당근 채팅 전용 랜딩 접수 API — Vercel 서버 함수 (POST /api/lead)
 * 2026-10-12 업무요청 DEV-2026-1008-001 (진수린 · 마케팅개발본부)
 *
 *   당근 채팅으로 이 랜딩 링크를 보내고, "예상 비용·기간을 문자로 안내"하는 조건으로 연락처를 받는다.
 *   받은 정보는 한평생 오피스 문의DB(hakjeom_consultations)에
 *   대분류 '당근' · 중분류 '채팅문자' (click_source = '당근_채팅문자') 로 넣는다.
 *   새 문의 알림(관리자 알림톡 · 오피스 알림)은 DB 트리거가 보낸다 — 여기서 따로 보내지 않는다.
 *
 * 문자 자동 발송은 아직 없다 — 담당자가 문의DB 를 보고 직접 안내한다.
 * 그래서 smsStatus 는 'queued'(접수됨 · 문자는 담당자가 보냄)로 답한다. 화면 문구는 index.html 의 messages.queued.
 *
 * 환경변수 (Vercel 프로젝트 설정에 직접 넣는다 — 코드·HTML 에 넣지 않는다)
 *   SUPABASE_URL                오피스 Supabase 주소
 *   SUPABASE_SERVICE_ROLE_KEY   서버 전용 키
 */

const CLICK_SOURCE = '당근_채팅문자';
const SMS_STATUS = 'queued';
/** 같은 번호로 이 시간 안에 다시 오면 새로 넣지 않는다 (두 번 누르기 · 새로고침 · 재시도) */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const EDUCATION = {
  high_school: '고등학교 졸업',
  college: '전문대 졸업',
  university: '대학교 졸업',
  other: '대학 재학·중퇴 / 기타',
};

const EXPERIENCE = {
  none: '처음 시작',
  some: '일부 과목 수강',
  unsure: '잘 모름',
};

function formatPhone(digits) {
  return digits.length === 11
    ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** 입력 검사 — 화면과 같은 규칙을 서버에서 한 번 더. 문제가 있으면 문구, 없으면 저장할 행 */
export function toConsultation(body) {
  const b = body && typeof body === 'object' ? body : {};
  const name = String(b.name ?? '').trim();
  const digits = String(b.phone ?? '').replace(/\D/g, '');
  const education = String(b.education ?? '');
  const experience = String(b.experience ?? '');
  if (name.length < 2 || name.length > 40) return { error: '성함을 확인해 주세요.' };
  if (!/^01(?:0\d{8}|[16789]\d{7,8})$/.test(digits)) return { error: '휴대폰 번호를 확인해 주세요.' };
  if (!Object.hasOwn(EDUCATION, education) || !Object.hasOwn(EXPERIENCE, experience)) {
    return { error: '학력과 수강 경험을 선택해 주세요.' };
  }
  if (b.privacyConsent !== true) return { error: '개인정보 수집·이용에 동의해 주세요.' };
  const version = String(b.privacyVersion ?? '').slice(0, 60);
  return {
    row: {
      name,
      contact: formatPhone(digits),
      education: EDUCATION[education],
      hope_course: '사회복지사',
      reason: `[당근 채팅 랜딩] 예상 비용·준비 기간 문자 안내 요청 · 수강 경험: ${EXPERIENCE[experience]}${version ? ` · 동의 ${version}` : ''}`,
      click_source: CLICK_SOURCE,
      status: '상담대기',
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ accepted: false, error: 'POST 만 받습니다.' });
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('[lead] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 없습니다.');
    return res.status(500).json({ accepted: false, error: '접수 설정이 아직 끝나지 않았습니다.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const { row, error } = toConsultation(body);
  if (error) return res.status(400).json({ accepted: false, error });

  const rest = `${url.replace(/\/$/, '')}/rest/v1/hakjeom_consultations`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  try {
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const q = new URLSearchParams({
      select: 'id',
      contact: `eq.${row.contact}`,
      click_source: `eq.${CLICK_SOURCE}`,
      created_at: `gte.${since}`,
      limit: '1',
    });
    const dup = await fetch(`${rest}?${q}`, { headers });
    if (dup.ok && (await dup.json()).length > 0) {
      return res.status(200).json({ accepted: true, smsStatus: SMS_STATUS });
    }

    const saved = await fetch(rest, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    });
    if (!saved.ok) {
      console.error('[lead] 저장 실패:', saved.status, await saved.text());
      return res.status(500).json({ accepted: false, error: '접수에 실패했습니다.' });
    }
    return res.status(201).json({ accepted: true, smsStatus: SMS_STATUS });
  } catch (e) {
    console.error('[lead] 오류:', e instanceof Error ? e.message : e);
    return res.status(500).json({ accepted: false, error: '접수에 실패했습니다.' });
  }
}

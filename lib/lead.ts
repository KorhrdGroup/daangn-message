/**
 * 당근 채팅 전용 랜딩 접수 — 2026-10-12 업무요청 DEV-2026-1008-001 (진수린 · 마케팅개발본부)
 *
 *   당근 채팅으로 이 랜딩 링크를 보내고, "예상 비용·기간을 문자로 안내"하는 조건으로 연락처를 받는다.
 *   받은 정보는 한평생 오피스 문의DB(hakjeom_consultations)에
 *   대분류 '당근' · 중분류 '채팅문자' (click_source = '당근_채팅문자') 로 넣는다.
 *   코드 주소(/123)로 들어오면 중분류 '문자랜딩_{코드}' (click_source = '당근_문자랜딩_123') — 2026-10-12 마케팅 요청.
 *   새 문의 알림(관리자 알림톡 · 오피스 알림)은 DB 트리거가 보낸다 — 여기서 따로 보내지 않는다.
 *
 * 문자는 보내지 않는다(2026-10-12 사용자 확정) — 담당자가 문의DB 를 보고 직접 연락해 안내한다.
 * 그래서 smsStatus 는 'queued'(접수됨 · 문자는 담당자가 보냄)로 답한다. 화면 문구는 components/EstimateForm 의 OUTCOME.queued.
 *
 * 환경변수 (.env.local / Vercel 설정 — 코드에 넣지 않는다)
 *   SUPABASE_URL                오피스 Supabase 주소
 *   SUPABASE_SERVICE_ROLE_KEY   서버 전용 키
 */

import { EDUCATION_OPTIONS, EXPERIENCE_OPTIONS, type Education, type Experience } from '@/lib/options';
import { PHONE_PATTERN, formatPhone } from '@/lib/phone';

/** 오피스 문의DB(hakjeom_consultations)에 넣는 행 — 오피스 쪽 컬럼 이름 그대로 */
export type ConsultationRow = {
  name: string;
  contact: string;
  education: string;
  hope_course: string;
  reason: string;
  /** 오피스 문의DB 목록의 '메모' 칸 — 사회복지 관련 과목 수강 경험을 화면에서 고른 문구 그대로 (2026-10-12) */
  memo: string;
  click_source: string;
  status: string;
};

export type SmsStatus = 'sent' | 'queued' | 'failed' | 'not_requested';

export const CLICK_SOURCE = '당근_채팅문자';
/** 코드 주소 랜딩 — 글자·숫자·-·_ 만, 40자까지 (주소에 그대로 쓰는 코드) */
const LANDING_CODE = /^[0-9A-Za-z가-힣_-]{1,40}$/;
export const isLandingCode = (code: string) => LANDING_CODE.test(code);
export const clickSourceFor = (code?: string) => (code ? `당근_문자랜딩_${code}` : CLICK_SOURCE);
export const SMS_STATUS: SmsStatus = 'queued';
/** 같은 번호로 이 시간 안에 다시 오면 새로 넣지 않는다 (두 번 누르기 · 새로고침 · 재시도) */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

/** 문의DB 학력 칸 — 오피스에 이미 쓰는 표기에 맞춘다 */
const EDUCATION_DB: Record<Education, string> = {
  high_school: '고등학교 졸업',
  college: '전문대 졸업',
  university: '대학교 졸업',
  other: '대학 재학·중퇴 / 기타',
};

const EXPERIENCE_DB: Record<Experience, string> = {
  none: '처음 시작',
  some: '일부 과목 수강',
  unsure: '잘 모름',
};

/** 메모에 넣는 문구 — 화면에서 고른 그대로 (처음 시작해요 / 일부 과목을 들었어요 / 잘 모르겠어요) */
const EXPERIENCE_LABEL = Object.fromEntries(EXPERIENCE_OPTIONS.map((o) => [o.value, o.label])) as Record<Experience, string>;

const isEducation = (v: string): v is Education => EDUCATION_OPTIONS.some((o) => o.value === v);
const isExperience = (v: string): v is Experience => EXPERIENCE_OPTIONS.some((o) => o.value === v);

/** 입력 검사 — 화면과 같은 규칙을 서버에서 한 번 더. 문제가 있으면 문구, 없으면 저장할 행 */
export function toConsultation(
  body: unknown,
): { row: ConsultationRow; error?: undefined } | { row?: undefined; error: string } {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const name = String(b.name ?? '').trim();
  const digits = String(b.phone ?? '').replace(/\D/g, '');
  const education = String(b.education ?? '');
  const experience = String(b.experience ?? '');
  if (name.length < 2 || name.length > 40) return { error: '성함을 확인해 주세요.' };
  if (!PHONE_PATTERN.test(digits)) return { error: '휴대폰 번호를 확인해 주세요.' };
  if (!isEducation(education) || !isExperience(experience)) return { error: '학력과 수강 경험을 선택해 주세요.' };
  if (b.privacyConsent !== true) return { error: '개인정보 수집·이용에 동의해 주세요.' };
  const version = String(b.privacyVersion ?? '').slice(0, 60);
  const rawCode = String(b.landingCode ?? '').trim();
  const code = rawCode && isLandingCode(rawCode) ? rawCode : '';
  return {
    row: {
      name,
      contact: formatPhone(digits),
      education: EDUCATION_DB[education],
      hope_course: '사회복지사',
      reason: `[당근 ${code ? `문자 랜딩 ${code}` : '채팅 랜딩'}] 예상 비용·준비 기간 안내 요청 · 수강 경험: ${EXPERIENCE_DB[experience]}${version ? ` · 동의 ${version}` : ''}`,
      memo: `사회복지 관련 과목: ${EXPERIENCE_LABEL[experience]}`,
      click_source: clickSourceFor(code),
      status: '상담대기',
    },
  };
}

/** 문의DB 에 넣는다 — 10분 안 같은 번호면 넣지 않고 성공으로 본다 */
export async function saveLead(row: ConsultationRow): Promise<{ ok: true; duplicate: boolean } | { ok: false; error: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 없습니다.' };

  const rest = `${url.replace(/\/$/, '')}/rest/v1/hakjeom_consultations`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const q = new URLSearchParams({
    select: 'id',
    contact: `eq.${row.contact}`,
    click_source: `eq.${row.click_source}`,
    created_at: `gte.${since}`,
    limit: '1',
  });
  const dup = await fetch(`${rest}?${q}`, { headers, cache: 'no-store' });
  if (dup.ok && ((await dup.json()) as unknown[]).length > 0) return { ok: true, duplicate: true };

  const saved = await fetch(rest, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(row),
    cache: 'no-store',
  });
  if (!saved.ok) return { ok: false, error: `저장 실패 ${saved.status}: ${await saved.text()}` };
  return { ok: true, duplicate: false };
}

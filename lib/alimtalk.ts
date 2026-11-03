/**
 * 신청자 알림톡 (알리고) — 2026-11-03 마케팅 요청 "선택값에 맞춰 알림톡"
 *
 *   신청이 문의DB 에 들어가면 화면에서 고른 학력 · 수강 경험에 맞는 템플릿을 신청자에게 보낸다.
 *   보내는 방식은 barosocial(lib/kakao.ts)과 같다 — 고정 IP 프록시가 있으면 그쪽으로, 없으면 알리고에 바로.
 *   알리고는 등록된 서버 IP 에서만 받는다 (그 밖에서는 -99 "인증되지 않는 서버 IP").
 *
 *   알림톡은 등록된 템플릿과 글자 · 줄바꿈 · 버튼까지 똑같아야 나간다 — message 는 알리고에 등록된 문구 그대로 둔다.
 *   템플릿이 아직 없는 조합은 보내지 않는다 (담당자가 문의DB 를 보고 직접 연락).
 *
 * 환경변수 (.env.local / Vercel 설정 — 코드에 넣지 않는다, barosocial 과 같은 값)
 *   ALIGO_API_KEY · ALIGO_USER_ID · ALIGO_SENDER_KEY · ALIGO_SENDER
 *   PROXY_URL · PROXY_SECRET   (선택) 카페24 고정 IP 프록시
 */

import type { Education, Experience } from '@/lib/options';

type Template = {
  code: string;
  /** 알림톡 실패 시 대체문자 제목 — failover 를 끄므로 화면에 나오지 않는다 */
  subject: string;
  message: string;
  /** 템플릿에 버튼이 있으면 알리고 형식 JSON 그대로 — 빠지면 "템플릿과 일치하지 않음"으로 실패 */
  button?: string;
};

/** 채널추가 버튼 — barosocial 과 같은 형식 */
const CHANNEL_ADD = JSON.stringify({ button: [{ name: '채널추가', linkType: 'AC', linkTypeName: '채널 추가' }] });

const TEMPLATES = {
  /** 문자랜딩 고졸 — 고등학교 졸업 · 처음 시작해요 / 잘 모르겠어요 */
  high_school: {
    code: 'UN_2379',
    subject: '나만의 비용 기간 확인하기',
    message: `안녕하세요! 한평생 원격교육원입니다 .
요청하신 [ 나만의 비용 기간 확인하기 ] 결과 보내드립니다.

🎓 고등학교를 졸업하고
처음 시작하는 학습자님이라면!

✅ 예상 학습 기간은 3~4학기
✅ 비용은 수강 과목에 따라 달라져요!

수강하시는 과목에 따라
학습 기간과 비용이 달라질 수 있어
담당자가 확인 후 정확한 기간과 비용을
바로 안내드리고 있습니다 💬`,
    button: CHANNEL_ADD,
  },
  // 문자랜딩 - 대졸 (UN_0910) · 문자랜딩 - 대학재학중퇴 (UN_0915) · 일부과목 들었어요 (UN_0911) — 문구 받으면 추가
} satisfies Record<string, Template>;

/** 고른 값 → 보낼 템플릿. 없으면 null (보내지 않음) */
export function pickTemplate(education: Education, experience: Experience): Template | null {
  if (experience === 'some') return null; // 일부과목 들었어요 (UN_0911) — 학력 상관없이, 문구 받으면 연결
  if (education === 'high_school') return TEMPLATES.high_school;
  return null; // 전문대·대졸 → 대졸(UN_0910), 재학·중퇴·기타 → 대학재학중퇴(UN_0915) — 문구 받으면 연결
}

/** 신청자에게 보낸다 — 실패해도 던지지 않고 결과만 돌려준다 (접수는 이미 끝났다) */
export async function sendAlimtalk(phone: string, tpl: Template): Promise<{ ok: true } | { ok: false; error: string }> {
  const apikey = process.env.ALIGO_API_KEY;
  const userid = process.env.ALIGO_USER_ID;
  const senderkey = process.env.ALIGO_SENDER_KEY;
  const sender = process.env.ALIGO_SENDER;
  if (!apikey || !userid || !senderkey || !sender) return { ok: false, error: 'ALIGO_* 환경변수가 없습니다.' };

  const payload: Record<string, string> = {
    apikey,
    userid,
    senderkey,
    tpl_code: tpl.code,
    sender,
    receiver_1: phone.replace(/\D/g, ''),
    subject_1: tpl.subject,
    message_1: tpl.message,
    failover: 'N',
  };
  if (tpl.button) payload.button_1 = tpl.button;

  const proxyUrl = process.env.PROXY_URL;
  const proxySecret = process.env.PROXY_SECRET;
  try {
    const response =
      proxyUrl && proxySecret
        ? await fetch(`${proxyUrl.replace(/\/$/, '')}/alimtalk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-proxy-secret': proxySecret },
            body: JSON.stringify(payload),
            cache: 'no-store',
          })
        : await fetch('https://kakaoapi.aligo.in/akv10/alimtalk/send/', {
            method: 'POST',
            body: new URLSearchParams(payload),
            cache: 'no-store',
          });
    const text = await response.text();
    let result: { code?: number; message?: string } | null = null;
    try {
      result = JSON.parse(text) as { code?: number; message?: string };
    } catch {
      return { ok: false, error: `응답 오류 ${response.status}: ${text.slice(0, 100)}` };
    }
    if (result.code === 0) return { ok: true };
    return { ok: false, error: `${result.code}: ${result.message}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * 폼 설정 — 디자이너 전달본의 window.LEAD_FORM_CONFIG 그대로 (2026-10-12 운영 연결).
 * mode 를 'preview' 로 바꾸면 저장·전송 없이 화면만 체험한다.
 */
export const LEAD_FORM_CONFIG = {
  mode: 'live' as 'live' | 'preview',
  endpoint: '/api/lead',
  /** 개인정보 안내 팝업 · 아래 '운영' 줄 — barosocial 개인정보처리방침과 같은 주체 */
  operatorName: '한평생교육',
  retentionPeriod: '상담 목적 달성 시까지 (파기 요청 시 지체 없이 파기)',
  privacyVersion: '2026-10-07-consultation-v4',
  campaign: 'karrot-chat-social-worker',
};

export const LIVE =
  LEAD_FORM_CONFIG.mode === 'live' &&
  Boolean(LEAD_FORM_CONFIG.endpoint) &&
  Boolean(LEAD_FORM_CONFIG.operatorName.trim()) &&
  Boolean(LEAD_FORM_CONFIG.retentionPeriod.trim());

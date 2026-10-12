/** 휴대폰 번호 — 화면(EstimateForm)과 접수 API(lib/lead) 가 같은 규칙을 쓴다 */

/** 숫자만 남긴 번호가 휴대폰인가 (010 은 11자리, 011·016~019 는 10~11자리) */
export const PHONE_PATTERN = /^01(?:0\d{8}|[16789]\d{7,8})$/;

/** 숫자 → 010-0000-0000 모양 (입력 중에도 쓴다) */
export function formatPhone(digits: string): string {
  if (digits.length > 7) {
    const mid = digits.length === 11 ? 7 : 6;
    return `${digits.slice(0, 3)}-${digits.slice(3, mid)}-${digits.slice(mid)}`;
  }
  return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
}

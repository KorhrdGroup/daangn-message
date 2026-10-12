/** 화면에서 고르는 값 — 화면(EstimateForm)과 접수 API(lib/lead) 가 같이 쓴다 */

export type Education = 'high_school' | 'college' | 'university' | 'other';
export type Experience = 'none' | 'some' | 'unsure';

export const EDUCATION_OPTIONS: { value: Education; label: string }[] = [
  { value: 'high_school', label: '고등학교 졸업' },
  { value: 'college', label: '전문대 졸업' },
  { value: 'university', label: '대학교 졸업 이상' },
  { value: 'other', label: '대학 재학·중퇴 / 기타' },
];

export const EXPERIENCE_OPTIONS: { value: Experience; label: string }[] = [
  { value: 'none', label: '처음 시작해요' },
  { value: 'some', label: '일부 과목을 들었어요' },
  { value: 'unsure', label: '잘 모르겠어요' },
];

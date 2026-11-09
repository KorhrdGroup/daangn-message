# daangn-message

한평생원격교육원 사회복지사 랜딩 — **당근 채팅 전용** (업무요청 DEV-2026-1008-001, 2026-10-12)

당근 채팅으로 이 링크를 보내면, 학생이 학력·수강 경험을 고르고 이름·번호를 남깁니다.
접수는 한평생 오피스 **문의DB** 에 `대분류 당근 · 중분류 채팅문자` (click_source `당근_채팅문자`) 로 들어갑니다. 코드 주소(`/123`)는 click_source `당근_문자랜딩_123`으로 저장됩니다.

Next.js (App Router) · TypeScript — 오피스 · barosocial 과 같은 방식.

## 파일
| 파일 | 내용 |
|---|---|
| `app/page.tsx` · `components/Landing.tsx` | 랜딩 화면 |
| `app/globals.css` | 화면 스타일 |
| `components/EstimateForm.tsx` | 비용·기간 신청 폼 · 분석 중 팝업 · 개인정보 안내 팝업 |
| `components/ReviewCarousel.tsx` · `MobileCta.tsx` | 후기 넘기기 · 휴대폰 아래 고정 버튼 |
| `app/api/lead/route.ts` · `lib/lead.ts` | 접수 API — 입력 검사 · 10분 안 같은 번호 중복 방지 · 문의DB 저장 |
| `lib/alimtalk.ts` | 선택한 학력·수강 경험에 맞는 신청자 알림톡 발송 |
| `lib/config.ts` | 폼 설정 (운영 주체 · 보유 기간 · 동의 문구 버전) |
| `public/assets/` | 이미지 |

## 내 컴퓨터에서 보기
```bash
npm install
cp .env.local.example .env.local   # 값은 직접 넣는다 (실제 키는 ZIP에 포함하지 않는다)
npm run dev                        # http://localhost:3000
```
⚠️ 환경변수를 설정한 컴퓨터에서 신청하면 **실제 오피스 문의DB에 저장되고 관리자 알림과 신청자 알림톡 발송이 시도된다.** 시험할 때는 이름에 "테스트"를 넣고 끝나면 지운다.

## 배포 (Vercel · 회사 계정 KorhrdGroup)
1. Vercel 에서 이 저장소 Import — Framework 는 Next.js 로 자동 인식
2. Environment Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ALIGO_API_KEY`, `ALIGO_USER_ID`, `ALIGO_SENDER_KEY`, `ALIGO_SENDER`
3. 알리고에 등록된 서버 IP에서 직접 발송할 수 없으면 고정 IP 프록시용 `PROXY_URL`, `PROXY_SECRET`도 설정한다.
4. 새 문의 알림(관리자 알림톡·오피스 알림)은 문의DB 트리거가 보낸다 — 여기서 따로 보내지 않는다.

## 신청자 알림톡
문의DB 저장에 성공하면 선택한 학력·수강 경험에 맞는 알리고 템플릿으로 신청자에게 알림톡을 보낸다. 10분 안에 같은 번호로 재신청하면 다시 보내지 않는다. 알림톡은 접수 응답 후 발송하므로 완료 화면은 발송 결과가 아닌 접수 완료를 표시한다. 발송 실패는 서버 로그의 `[alimtalk] 실패`에서 확인한다.

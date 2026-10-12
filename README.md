# daangn-message

한평생원격교육원 사회복지사 랜딩 — **당근 채팅 전용** (업무요청 DEV-2026-1008-001, 2026-10-12)

당근 채팅으로 이 링크를 보내면, 학생이 학력·수강 경험을 고르고 이름·번호를 남깁니다.
접수는 한평생 오피스 **문의DB** 에 `대분류 당근 · 중분류 채팅문자` (click_source `당근_채팅문자`) 로 들어갑니다.

Next.js (App Router) · TypeScript — 오피스 · barosocial 과 같은 방식.

## 파일
| 파일 | 내용 |
|---|---|
| `app/page.tsx` | 화면 전체 — 디자이너 전달본(2026-10-08 index.html) 그대로 |
| `app/globals.css` | 전달본 styles.css 그대로 |
| `components/EstimateForm.tsx` | 비용·기간 신청 폼 · 분석 중 팝업 · 개인정보 안내 팝업 |
| `components/ReviewCarousel.tsx` · `MobileCta.tsx` | 후기 넘기기 · 휴대폰 아래 고정 버튼 |
| `app/api/lead/route.ts` · `lib/lead.ts` | 접수 API — 입력 검사 · 10분 안 같은 번호 중복 방지 · 문의DB 저장 |
| `lib/config.ts` | 폼 설정 (운영 주체 · 보유 기간 · 동의 문구 버전) |
| `public/assets/` | 이미지 |

## 내 컴퓨터에서 보기
```bash
npm install
cp .env.local.example .env.local   # 값은 직접 넣는다 (오피스 .env 의 Supabase 주소·서비스 키)
npm run dev                        # http://localhost:3000
```
⚠️ 내 컴퓨터에서 신청해도 **실제 오피스 문의DB 에 들어가고 관리자 알림톡도 나간다.** 시험할 때는 이름에 "테스트" 를 넣고 끝나면 지운다.

## 배포 (Vercel · 회사 계정 KorhrdGroup)
1. Vercel 에서 이 저장소 Import — Framework 는 Next.js 로 자동 인식
2. Environment Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
3. 새 문의 알림(관리자 알림톡·오피스 알림)은 문의DB 트리거가 보낸다 — 여기서 따로 보내지 않는다

## 문자 발송
지금은 자동 발송이 없다 — 담당자가 문의DB 를 보고 안내한다(완료 화면: "문자는 발송 대기 중").
자동으로 보내려면 비용·기간 표(학력 × 수강 경험)를 정하고, `lib/lead.ts` 저장 뒤에 알리고(Aligo) 문자/알림톡을 보내면 된다.

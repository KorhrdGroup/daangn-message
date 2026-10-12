# daangn-message

한평생원격교육원 사회복지사 랜딩 — **당근 채팅 전용** (업무요청 DEV-2026-1008-001, 2026-10-12)

당근 채팅으로 이 링크를 보내면, 학생이 학력·수강 경험을 고르고 이름·번호를 남깁니다.
접수는 한평생 오피스 **문의DB** 에 `대분류 당근 · 중분류 채팅문자` (click_source `당근_채팅문자`) 로 들어갑니다.

| 파일 | 내용 |
|---|---|
| `index.html` · `styles.css` · `assets/` | 디자이너 전달본(2026-10-08) 그대로 — 폼 설정만 `mode: 'live'`, `endpoint: '/api/lead'` |
| `api/lead.js` | 접수 API (Vercel 서버 함수, 설치할 패키지 없음) — 검사 · 10분 안 같은 번호 중복 방지 · 문의DB 저장 |

## 배포 (Vercel)
1. 이 폴더를 GitHub 저장소로 올리고 Vercel 에서 Import — Framework: **Other**, 빌드 명령 없음
2. Environment Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (오피스와 같은 Supabase)
3. 새 문의 알림(관리자 알림톡·오피스 알림)은 문의DB 트리거가 보낸다 — 여기서 따로 보내지 않는다

## 문자 발송
지금은 자동 발송이 없다 — 담당자가 문의DB 를 보고 안내한다(화면 문구: "문자는 발송 대기 중").
자동으로 보내려면 비용·기간 표(학력 × 수강 경험)를 정하고, `api/lead.js` 저장 뒤에 알리고(Aligo) 문자/알림톡을 보내면 된다.

import { NextResponse, after } from 'next/server';
import { pickTemplate, sendAlimtalk } from '@/lib/alimtalk';
import { SMS_STATUS, saveLead, toConsultation } from '@/lib/lead';

// 당근 채팅 랜딩 접수 — POST /api/lead → 오피스 문의DB(당근_채팅문자). 규칙은 lib/lead.ts
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = toConsultation(body);
  if (!parsed.row) return NextResponse.json({ accepted: false, error: parsed.error }, { status: 400 });

  try {
    const result = await saveLead(parsed.row);
    if (!result.ok) {
      console.error('[lead]', result.error);
      return NextResponse.json({ accepted: false, error: '접수에 실패했습니다.' }, { status: 500 });
    }
    // 신청자 알림톡 — 고른 값에 맞는 템플릿으로 (lib/alimtalk pickTemplate), 10분 안 같은 번호 재신청(duplicate)에는 다시 보내지 않는다.
    // 응답을 먼저 보내고 뒤에서 보낸다 (알리고가 느려도 화면이 기다리지 않게)
    const tpl = result.duplicate ? null : pickTemplate(parsed.choice.education, parsed.choice.experience);
    if (tpl) {
      const phone = parsed.row.contact;
      after(async () => {
        const sent = await sendAlimtalk(phone, tpl);
        if (sent.ok) console.log('[alimtalk] 전송', tpl.code);
        else console.error('[alimtalk] 실패', tpl.code, sent.error);
      });
    }
    return NextResponse.json({ accepted: true, smsStatus: SMS_STATUS }, { status: result.duplicate ? 200 : 201 });
  } catch (e) {
    console.error('[lead] 오류:', e instanceof Error ? e.message : e);
    return NextResponse.json({ accepted: false, error: '접수에 실패했습니다.' }, { status: 500 });
  }
}

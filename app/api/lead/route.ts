import { NextResponse } from 'next/server';
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
    return NextResponse.json({ accepted: true, smsStatus: SMS_STATUS }, { status: result.duplicate ? 200 : 201 });
  } catch (e) {
    console.error('[lead] 오류:', e instanceof Error ? e.message : e);
    return NextResponse.json({ accepted: false, error: '접수에 실패했습니다.' }, { status: 500 });
  }
}

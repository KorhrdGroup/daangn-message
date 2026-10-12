import { notFound } from 'next/navigation';
import Landing from '@/components/Landing';
import { isLandingCode } from '@/lib/lead';

/**
 * 코드 주소 랜딩 — https://daangn-message.vercel.app/123 (2026-10-12 마케팅 요청 "랜딩페이지에 쓰려는데 404").
 * 화면은 첫 화면과 같고, 이 주소로 들어온 문의는 문의DB 유입경로 '당근_문자랜딩_{코드}' (대분류 당근 · 중분류 문자랜딩_코드).
 */
export default async function CodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const decoded = decodeURIComponent(code);
  if (!isLandingCode(decoded)) notFound();
  return <Landing code={decoded} />;
}

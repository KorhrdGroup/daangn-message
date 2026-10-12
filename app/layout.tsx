import type { Metadata, Viewport } from 'next';
import './globals.css';

const TITLE = '한평생원격교육원 | 사회복지사 비용·기간 안내';
const DESCRIPTION = '사회복지사 비용·기간, 내 조건으로 한 번에. 최종학력과 수강 경험에 맞는 예상 비용과 준비 기간을 안내받으세요.';

export const metadata: Metadata = {
  // og:image 는 절대 주소여야 한다 — 당근 채팅 미리보기는 og 태그만 읽는다 (2026-10-12: 카톡은 본문 첫 큰 사진으로
  // 대신 그려서 나왔고, 당근은 og 태그가 없어 사진이 안 나왔다)
  metadataBase: new URL('https://daangn-message.vercel.app'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '한평생원격교육원',
    url: '/',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/assets/og-image.jpg', width: 1200, height: 630, alt: '사회복지사 비용·기간 안내' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/assets/og-image.jpg'],
  },
  robots: { index: false, follow: false },
  referrer: 'strict-origin-when-cross-origin',
  // 탭 아이콘 = app/favicon.ico (오피스와 같은 아이콘, 2026-10-12)
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

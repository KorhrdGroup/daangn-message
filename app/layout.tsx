import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '한평생원격교육원 | 사회복지사 비용·기간 안내',
  description:
    '사회복지사 비용·기간, 내 조건으로 한 번에. 최종학력과 수강 경험에 맞는 예상 비용과 준비 기간을 문자로 안내받으세요.',
  robots: { index: false, follow: false },
  referrer: 'strict-origin-when-cross-origin',
  icons: { icon: '/assets/han-lifetime-logo.png' },
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

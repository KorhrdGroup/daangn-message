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

// 당근 비즈니스 전환 추적 코드 '문자랜딩' (2026-10-14) — 당근 안내대로 </head> 바로 위에 둔다
const KARROT_PIXEL_ID = '1791947966869242001';
const KARROT_PIXEL = `
  (function (w, d) {
    if (w.karrotPixel) return;
    var k = { stub: true, queue: [] };
    k.init = function () { k.queue.push(['init', arguments, Date.now()]); };
    k.track = function () { k.queue.push(['track', arguments, Date.now()]); };
    w.karrotPixel = k;
    var s = d.createElement('script');
    s.async = true;
    s.src = 'https://karrot-pixel.business.daangn.com/karrot-pixel.js';
    var f = d.getElementsByTagName('script')[0];
    f && f.parentNode ? f.parentNode.insertBefore(s, f) : d.head.appendChild(s);
  })(window, document);
  window.karrotPixel.init('${KARROT_PIXEL_ID}');
  window.karrotPixel.track('ViewPage');
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Danggeun Market Code */}
        <script dangerouslySetInnerHTML={{ __html: KARROT_PIXEL }} />
        {/* End Danggeun Market Code */}
      </head>
      <body>{children}</body>
    </html>
  );
}

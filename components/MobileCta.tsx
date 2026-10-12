'use client';

import { useEffect, useState } from 'react';

/** 휴대폰 화면 아래 고정 버튼 — 신청 폼이 화면에 보이면 숨긴다 (전달본 script 의 mobile-cta 부분) */
export default function MobileCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById('estimate');
    if (!target || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => setHidden(entries[0].isIntersecting), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`mobile-cta${hidden ? ' hidden' : ''}`} id="mobile-cta">
      <p>
        내 조건에 맞는<b>비용과 준비 기간</b>
      </p>
      <a className="button" href="#estimate">
        비용·기간 확인
      </a>
    </div>
  );
}

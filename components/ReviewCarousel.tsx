'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** 학습자 후기 — 좌우 버튼으로 한 장씩 넘긴다 (전달본 script 의 review-track 부분) */
export default function ReviewCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener('scroll', update, { passive: true });
    // 화면 폭이 바뀌면 버튼 상태도 다시 (ResizeObserver 가 없는 옛 브라우저는 창 크기 변화로)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
    if (observer) observer.observe(track);
    else window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      observer?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('.review-card');
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reduce ? 'instant' : 'smooth' });
  };

  return (
    <>
      <div className="reviews-toolbar">
        <p>학습자들이 직접 전하는 이야기</p>
        <div className="review-controls">
          <button type="button" id="review-previous" aria-label="이전 후기" aria-controls="review-track" disabled={atStart} onClick={() => move(-1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" id="review-next" aria-label="다음 후기" aria-controls="review-track" disabled={atEnd} onClick={() => move(1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div className="review-track" id="review-track" ref={trackRef} role="region" aria-label="실제 학습자 후기 5개, 좌우로 넘겨 보기" tabIndex={0}>
        <article className="review-card" aria-labelledby="review-title-1"><p className="review-meta">47세 경력단절 주부, 재취업 성공</p><h3 id="review-title-1">막막했던 재취업에<br />자신감이 생겼어요.</h3><p className="review-author">김*선 님</p><blockquote>아이들을 키우느라 오랫동안 일을 쉬어 재취업이 가능할지 걱정이 많았습니다. 나이도 있고 경력 공백도 길어서 자신감이 많이 떨어진 상태였는데, 사회복지사 자격증을 취득한 후 관련 분야로 취업까지 하게 되었어요. 그동안의 고민이 무색할 만큼 새로운 시작을 할 수 있었습니다.</blockquote></article>
        <article className="review-card" aria-labelledby="review-title-2"><p className="review-meta">65세 정년퇴직 후 취업 성공</p><h3 id="review-title-2">나이가 걸림돌이<br />되지 않았어요.</h3><p className="review-author">김*숙 님</p><blockquote>요즘은 다들 너무 건강해요~ 정년퇴직 후 앞으로 어떻게 시간을 보내야 할지 고민이 많았습니다. 단순히 쉬기보다는 보람 있는 일을 하고 싶어 사회복지사 자격증에 도전했어요. 나이 때문에 걱정도 했지만 취득 후 관련 시설에 취업까지 하게 되면서 제2의 인생을 시작한 기분입니다.</blockquote></article>
        <article className="review-card" aria-labelledby="review-title-3"><p className="review-meta">52세 퇴직 준비자도 취득 성공</p><h3 id="review-title-3">노후 대비가 한결<br />든든해졌습니다.</h3><p className="review-author">최*수 님</p><blockquote>퇴직이 가까워지면서 앞으로 무엇을 해야 할지 고민이 많았습니다. 사회복지 분야에 관심은 있었지만 나이가 많아 시작하기 망설여졌는데, 생각보다 많은 분들이 비슷한 상황에서 준비하고 계시더라고요. 덕분에 용기를 내어 시작했고 만족스러운 결과를 얻었습니다.</blockquote></article>
        <article className="review-card" aria-labelledby="review-title-4"><p className="review-meta">37세 워킹맘도 취득 성공</p><h3 id="review-title-4">육아와 병행할 수<br />있었어요.</h3><p className="review-author">정*미 님</p><blockquote>아이를 키우면서 일을 하고 있어 시간을 내기가 쉽지 않았습니다. 그래서 계속 미루고 있었는데, 온라인으로 진행할 수 있어 부담이 적었고 일정 관리도 도움을 받아 끝까지 완주할 수 있었습니다. 저처럼 시간이 부족한 분들에게 큰 도움이 될 것 같아요.</blockquote></article>
        <article className="review-card" aria-labelledby="review-title-5"><p className="review-meta">58세, 친구와 함께 도전</p><h3 id="review-title-5">혼자가 아니라서<br />끝까지 할 수 있었어요.</h3><p className="review-author">신*자 님</p><blockquote>50대 후반이 되니 노후 준비에 대한 고민이 많아졌습니다. 혼자 시작하기엔 망설여졌는데 친구와 함께 도전하자는 이야기가 나와 용기를 냈어요. 서로 응원하며 공부하다 보니 어느새 둘 다 사회복지사 자격증을 취득하게 되었고, 지금은 관련 분야 취업도 준비하고 있습니다.</blockquote></article>
      </div>
    </>
  );
}

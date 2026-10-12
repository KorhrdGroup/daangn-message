import EstimateForm from '@/components/EstimateForm';
import MobileCta from '@/components/MobileCta';
import ReviewCarousel from '@/components/ReviewCarousel';
import { LEAD_FORM_CONFIG, LIVE } from '@/lib/config';

/* eslint-disable @next/next/no-img-element -- 디자이너 전달본의 이미지 크기·속성을 그대로 쓴다 */

/**
 * 한평생원격교육원 사회복지사 — 당근 채팅 전용 비용·기간 안내 랜딩.
 * 디자이너 전달본(2026-10-08 index.html) 화면을 그대로 옮겼다. 움직이는 부분만 components/ 에 나눴다:
 *   후기 넘기기 = ReviewCarousel · 비용·기간 신청 폼과 팝업 = EstimateForm · 아래 고정 버튼 = MobileCta
 */
export default function Page() {
  return (
    <>
      <a className="skip" href="#main">본문으로 이동</a>
      <header className="header">
        <div className="wrap header-inner">
          <a className="logo" href="#main" aria-label="한평생원격교육원 처음으로"><img className="brand-logo" src="/assets/han-lifetime-logo.png" alt="한평생원격교육원" width="708" height="80" /></a>
          <nav aria-label="페이지 안내"><a href="#comparison">한평생의 지원</a><a href="#reviews">학습자 후기</a><a href="#faq">궁금한 점</a></nav>
          <a className="button small header-cta" href="#estimate">비용·기간 확인</a>
        </div>
      </header>
      <noscript><p className="noscript">조건 선택과 입력 화면을 사용하려면 브라우저의 JavaScript를 켜주세요.</p></noscript>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-photo" src="/assets/hero.png" alt="" width="1122" height="1402" fetchPriority="high" />
          <div className="hero-content">
            <div className="pill"><span className="pill-mark" aria-hidden="true">🥕</span>당근 학습자 전용 안내</div>
            <h1 id="hero-title">사회복지사 비용·기간,<br /><em>내 조건으로 한 번에.</em></h1>
            <p className="hero-copy"><span>얼마나 들고, 얼마나 걸릴지 궁금하셨죠?</span> <span>내 학력과 수강 경험에 맞는 예상 비용과</span> <span>준비 기간을 문자로 편하게 받아보세요.</span></p>
            <a className="button" href="#estimate">내 비용·기간 알아보기</a>
          </div>
        </section>
        <p className="hero-caption">당근 채팅으로 안내받은 분을 위한 비용·기간 확인 페이지</p>
        <section id="certificate" className="wrap certificate-highlight" aria-labelledby="certificate-title">
          <div className="certificate-panel">
            <div className="certificate-copy"><span className="certificate-label">사회복지사 2급</span><h2 id="certificate-title">보건복지부 발급<br /><em>국가자격증</em></h2><span className="certificate-heading-line" aria-hidden="true"></span></div>
            <figure className="certificate-photo">
              <div className="certificate-documents">
                <div className="certificate-document certificate-cover"><img src="/assets/certificate-cover.webp?v=clean-paper" alt="사회복지사 자격증의 주황색 표지" width="740" height="1088" loading="lazy" decoding="async" /></div>
                <div className="certificate-document certificate-front"><img src="/assets/certificate-scan-redacted.webp?v=soft-edges" alt="이름, 생년월일, 발급일, 자격증 번호와 증명사진을 가린 실제 사회복지사 2급 자격증 스캔본" width="960" height="1284" loading="lazy" decoding="async" /></div>
              </div>
              <figcaption>실제 취득하게 될<br /><strong>보건복지부 발급 국가자격증</strong></figcaption>
            </figure>
          </div>
        </section>
        <section id="careers" className="wrap section careers" aria-labelledby="careers-title">
          <div className="section-heading"><span className="eyebrow">자격 취득 후, 어떤 일을 할 수 있을까요?</span><h2 id="careers-title">사회복지사가 일하는 곳,<br />생각보다 다양해요.</h2><p>노인부터 아동·청소년, 여성과 가족까지.<br />관심 있는 분야에서 내 다음 일을 그려보세요.</p></div>
          <div className="career-grid">
            <article className="career-card">
              <span className="career-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"/></svg></span>
              <h3>노인 복지</h3><p className="career-role">어르신의 일상과 돌봄 지원</p><ul><li>노인복지관</li><li>주야간보호센터·요양시설</li></ul>
            </article>
            <article className="career-card">
              <span className="career-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/></svg></span>
              <h3>아동 복지</h3><p className="career-role">아이들의 성장과 돌봄 지원</p><ul><li>지역아동센터</li><li>아동양육시설</li></ul>
            </article>
            <article className="career-card">
              <span className="career-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg></span>
              <h3>청소년 복지</h3><p className="career-role">청소년의 보호와 자립 지원</p><ul><li>청소년쉼터</li><li>청소년자립지원관</li></ul>
            </article>
            <article className="career-card">
              <span className="career-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg></span>
              <h3>여성·가족 복지</h3><p className="career-role">안전한 생활과 자립 지원</p><ul><li>한부모가족복지시설</li><li>여성 보호·지원시설</li></ul>
            </article>
            <article className="career-card">
              <span className="career-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg></span>
              <h3>장애인 복지</h3><p className="career-role">일상과 사회 참여 지원</p><ul><li>장애인복지관</li><li>장애인 거주·직업재활시설</li></ul>
            </article>
            <article className="career-card">
              <span className="career-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
              <h3>지역사회 복지</h3><p className="career-role">이웃에게 필요한 복지 연결</p><ul><li>종합사회복지관</li><li>지역자활센터</li></ul>
            </article>
          </div>
          <div className="career-next"><p>사회복지사 자격증 1개만 따도<br /><strong>모든 분야에 취업이 가능합니다.</strong></p><a className="button" href="#estimate">내 비용·기간 알아보기</a></div>
          <p className="career-note">위에 소개한 복지 분야의 진출 가능성을 뜻하며, 실제 채용은 기관·직무별 자격 등급·경력·추가 교육 등의 요건을 충족해야 합니다.</p>
        </section>
        <section id="learning" className="wrap section intro-grid" aria-labelledby="intro-title">
          <div className="section-heading"><span className="eyebrow">처음이어도, 오랜만이어도 괜찮아요</span><h2 id="intro-title">온라인으로 집에서 편하게,<br />1:1 담당자와 든든하게.</h2><p>공부를 다시 시작하는 게 낯설어도,<br />나이 때문에 망설이고 계셔도.<br />차근차근 준비할 수 있도록 함께할게요.</p></div>
          <div className="reasons">
            <article className="support-card"><span className="support-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></span><div><h3>학원 출석 대신, 온라인 수업</h3><p>이론 강의는 집에서 온라인으로.<br /><strong>휴대폰으로도 수강할 수 있어요.</strong></p></div></article>
            <article className="support-card"><span className="support-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg></span><div><h3>60대도 시작할 수 있어요</h3><p>나이 때문에 포기하지 않으셔도 돼요.<br />내 학력과 상황에 맞춰 준비해요.</p></div></article>
            <article className="support-card"><span className="support-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg></span><div><h3>혼자 헤매지 않도록, 1:1 관리</h3><p>수강 방법부터 학습 일정까지.<br /><strong>담당자가 단계별로 안내해 드려요.</strong></p></div></article>
            <p className="support-note">현장실습은 실습기관에서 진행해요. 실습 세미나 등 대면 일정은 별도로 안내해 드립니다.</p>
          </div>
        </section>
        <section id="comparison" className="comparison" aria-labelledby="comparison-title">
          <div className="wrap">
            <div className="section-heading comparison-heading"><span className="eyebrow">유독 소개를 많이 해주시는 학습자분들</span><h2 id="comparison-title">한평생은 자신 있습니다!</h2><p>수업부터 실습, 취업 준비까지.<br />혼자 걱정하지 않도록 함께합니다.</p></div>
            <div className="comparison-grid">
              <article className="comparison-worries" aria-labelledby="worries-title">
                <span className="comparison-kicker">다른 곳을 알아보며</span><h3 id="worries-title">이런 걱정, 있으셨죠?</h3>
                <ul className="worry-list">
                  <li><span>수업</span><p>혼자 알아서<br />따라가야 할까?</p></li>
                  <li><span>비용</span><p>불합격하면 비용을<br />다시 내야 할까?</p></li>
                  <li><span>실습</span><p>이론이 끝나면 실습기관은<br />혼자 찾아야 할까?</p></li>
                  <li><span>취업</span><p>취업 이야기는<br />어디서부터 해야 할까?</p></li>
                </ul>
              </article>
              <span className="comparison-versus" aria-hidden="true">VS</span>
              <div id="comparison-designs" className="comparison-benefits">
              <article id="han-support-card" className="comparison-han" aria-labelledby="han-support-title">
                <div className="han-support-header"><span className="han-support-badge">한평생과 함께라면</span><h3 id="han-support-title">시작부터 취업 준비까지,<br /><em>함께 챙겨드릴게요.</em></h3></div>
                <ul className="han-support-list">
                  <li><span className="han-support-check" aria-hidden="true">✓</span><div><h4>1:1 담당자 밀착 케어</h4><p>수강 방법부터 학습 일정까지 함께 확인해요.</p></div></li>
                  <li><span className="han-support-check" aria-hidden="true">✓</span><div><h4>과목 불합격 시<br /><strong>100% 환급제도</strong></h4><p>담당자가 안내해준 학습과정대로 했는데 불합격 됐다면 전액 환급해드려요.</p></div></li>
                  <li><span className="han-support-check" aria-hidden="true">✓</span><div><h4>거주지 근처 실습 직접 매칭</h4><p>가까운 실습기관을 찾는 과정도 함께해요.</p></div></li>
                </ul>
                <div id="employment" className="han-employment" aria-labelledby="employment-title">
                  <img className="employment-art" src="/assets/agreement-3d.webp" alt="" width="512" height="512" loading="lazy" decoding="async" />
                  <p className="employment-label"><span className="employment-label-check" aria-hidden="true">✓</span>여성인력개발센터 정식 협약</p>
                  <h4 id="employment-title">자격증 준비부터<br />취업 연계까지 함께해요.</h4>
                  <p className="employment-description">한평생은 실제 여성인력개발센터와 정식 협약을 맺고 <strong>자격증 취득 후 취업 연계를 지원합니다.</strong></p>
                </div>
              </article>
              </div>
            </div>
            <div className="comparison-next"><p>내 상황에 맞는 준비 방법부터<br /><strong>확인해 보세요.</strong></p><a className="button" href="#estimate">나만의 비용 기간 확인하기</a></div>
          </div>
        </section>
        <section id="guide" className="wrap section deliver" aria-labelledby="guide-title">
          <div className="deliver-head"><div className="section-heading"><span className="eyebrow">내게 필요한 정보만</span><h2 id="guide-title">얼마가 필요한지,<br />얼마나 준비해야 하는지.</h2></div><p>선택한 조건을 바탕으로<br />세 가지를 함께 정리해 드려요.</p></div>
          <div className="deliver-grid">
            <article className="deliver-card">
              <div className="deliver-card-top" aria-hidden="true"><span className="feature-icon cost-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg></span><span className="deliver-index">01</span></div>
              <h3>예상 수강료 범위</h3><p>최종학력과 관련 과목 수강 경험을 기준으로, 대략적인 수강료 범위를 안내해 드려요.</p>
            </article>
            <article className="deliver-card">
              <div className="deliver-card-top" aria-hidden="true"><span className="feature-icon duration-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg></span><span className="deliver-index">02</span></div>
              <h3>예상 준비 기간</h3><p>내 학력과 수강 경험을 바탕으로 준비에 필요한 예상 기간을 안내해 드려요. 수강 시작 시점과 실습 등 확인이 필요한 일정도 함께 짚어드려요.</p>
            </article>
            <article className="deliver-card">
              <div className="deliver-card-top" aria-hidden="true"><span className="feature-icon checklist-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg></span><span className="deliver-index">03</span></div>
              <h3>별도 비용·확인 사항</h3><p>실습비 등 별도 비용과 이미 이수한 과목, 앞으로의 수강·실습 일정처럼 정확한 비용·기간 안내에 필요한 사항을 정리해 드려요.</p>
            </article>
          </div>
          <p className="deliver-sub">비용과 준비 기간은 예상 범위이며, 실제 이수 내역과 선택 과정, 수강·실습 일정 등을 확인한 뒤 달라질 수 있습니다.</p>
        </section>
        <section id="faq" className="wrap section faq" aria-labelledby="faq-title"><div className="faq-layout">
          <div><span className="eyebrow">시작 전에 궁금한 점</span><h2 id="faq-title">편하게 확인해 보세요.</h2></div>
          <div className="faq-list">
            <details><summary>어디서 수업을 듣나요? 학원에 다녀야 하나요?</summary><p>이론 수업은 온라인으로 진행하므로 학원에 정기적으로 방문하지 않고 집에서도 들을 수 있어요. PC뿐 아니라 휴대폰으로도 강의를 수강할 수 있습니다. 다만 현장실습은 실습기관에서 진행하며, 실습 세미나 등 대면 일정은 별도로 안내해 드려요.</p></details>
            <details><summary>나이 제한이 있나요? 60대도 가능한가요?</summary><p>네, 60대도 준비하실 수 있어요. 자격 취득 준비에는 별도의 연령 상한이 없으며, 필요한 학력과 과목 이수·실습 요건을 충족하면 됩니다. 공부가 오랜만이라 걱정되셔도 1:1 담당자가 준비 순서와 학습 일정을 차근차근 안내해 드려요.</p></details>
            <details><summary>검정고시로 고등학교를 졸업했는데, 가능한가요?</summary><p><strong>네, 검정고시 고등학교 졸업자도 가능해요.</strong> 검정고시 출신이라는 이유로 수강이나 자격 취득에 불이익은 없습니다.<br /><br />고졸 학력에 맞춘 과정을 끝까지 이수하고 필요한 학점 등 학위 요건을 충족하면, <strong>사회복지사 자격증과 함께 사회복지 전공 학위도 취득할 수 있어요.</strong></p></details>
            <details><summary>온라인 수업이 처음인데, 혼자 할 수 있을까요?</summary><p>혼자 알아보고 진행하실 필요 없어요. 1:1 담당자가 수강 방법과 학습 일정을 안내하고, 진행 중 궁금한 점도 확인해 드립니다. 처음 시작하는 분도 따라갈 수 있도록 단계별로 도와드려요.</p></details>
            <details><summary>비용·기간 안내를 받으면 수강 신청이 되나요?</summary><p>아니요. 예상 비용과 준비 기간을 안내받는 단계이며, 수강 신청이나 결제가 진행되지 않습니다. 내용을 확인한 후 준비 여부를 결정하시면 됩니다.</p></details>
            <details><summary>준비 기간은 무엇을 기준으로 안내하나요?</summary><p>최종학력과 이미 이수한 과목, 수강 시작 시점과 실습 일정 등을 확인해 예상 준비 기간을 안내해 드려요. 처음에는 선택한 조건을 기준으로 안내하고, 추가로 확인이 필요한 내용도 함께 알려드립니다.</p></details>
            <details><summary>문자에 나온 비용과 기간은 확정인가요?</summary><p>선택하신 정보를 바탕으로 안내하는 예상 범위입니다. 실제 이수 내역과 과정, 수강·실습 일정 등을 확인하면서 달라질 수 있어요. 안내받은 기간은 준비 계획을 위한 참고이며, 자격증 발급 시점이 확정된 것은 아닙니다.</p></details>
            <details><summary>자격증 취득 후 취업도 도와주시나요?</summary><p>네. 한평생원격교육원은 여성인력개발센터와 정식 협약을 맺고 취업 연계를 지원합니다. 취업 연계의 자세한 내용은 담당자에게 안내받으실 수 있어요.</p></details>
            <details><summary>관련 과목을 들었는지 잘 모르겠어요.</summary><p>‘잘 모르겠어요’를 선택하시면 됩니다. 정확한 확인을 위해 이수 내역이 필요한 경우, 안내 문자에서 추가로 확인할 사항을 알려드려요.</p></details>
          </div>
        </div></section>
        <section id="reviews" className="reviews" aria-labelledby="reviews-title">
          <div className="wrap">
            <div className="section-heading"><span className="eyebrow">실제 학습자 후기</span><h2 id="reviews-title">먼저 시작한 분들의<br />이야기를 만나보세요.</h2><p>다시 일을 시작하고 싶은 마음도,<br />새로운 내일을 준비하는 마음도 함께했어요.</p></div>
            <div className="learner-gallery" aria-label="실제 학습 현장 사진 모음">
              <figure><img src="/assets/learner-certificate-01.webp" alt="학습자와 담당자가 함께한 자격증 수여 현장" width="531" height="533" loading="lazy" decoding="async" /><figcaption>기다리던 자격증을 받는 순간</figcaption></figure>
              <figure><img src="/assets/learner-certificate-02.webp" alt="자격증을 받은 학습자와 담당자의 기념사진" width="664" height="663" loading="lazy" decoding="async" /><figcaption>담당자와 함께한 기분 좋은 마무리</figcaption></figure>
              <figure><img src="/assets/learner-practice.webp" alt="함께 모여 사회복지 실습 명찰을 들고 있는 학습자들" width="960" height="960" loading="lazy" decoding="async" /><figcaption>함께라서 더 든든한 실습</figcaption></figure>
              <figure><img className="learner-classroom-photo" src="/assets/learner-classroom.webp" alt="학습자들이 함께 모인 교육 현장" width="960" height="720" loading="lazy" decoding="async" /><figcaption>새로운 시작을 준비하는 현장</figcaption></figure>
            </div>
            <ReviewCarousel />
            <p className="review-swipe-hint">옆으로 넘겨 더 많은 후기를 읽어보세요.</p>
          </div>
        </section>
        <section id="your-start" className="closing" aria-labelledby="closing-title">
          <div className="closing-scene">
            <img className="closing-background" src="/assets/hopeful-woman-sunlight.jpg" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
            <div className="wrap"><div className="closing-copy">
              <span className="eyebrow">새로운 시작을 고민하는 당신에게</span>
              <h2 id="closing-title">다시 시작하는 공부,<br />혼자가 아니에요.</h2>
              <p>‘나도 할 수 있을까?’ 하는 마음,<br />그 작은 관심부터 시작해도 괜찮아요.</p>
              <p>지금 모든 걸 결정하지 않아도 돼요.<br />내 상황에 맞는 비용과 준비 기간부터<br />차근차근 알아보세요.</p>
              <a className="button" href="#estimate">내 비용·기간 알아보기</a>
              <p className="closing-support">당신의 첫걸음을 한평생원격교육원이 응원합니다.</p>
            </div></div>
          </div>
        </section>
        <section id="how" className="journey" aria-labelledby="how-title"><div className="wrap journey-grid">
          <div><span className="eyebrow">복잡한 상담 예약 없이</span><h2 id="how-title">확인은 간단하게.</h2></div>
          <ol className="steps"><li><span className="step-number" aria-hidden="true">01</span><h3>내 준비 상황 선택</h3><p>학력과 관련 과목 수강 경험을 알려주세요.</p></li><li><span className="step-number" aria-hidden="true">02</span><h3>문자 받을 정보 입력</h3><p>성함과 휴대폰 번호를 남겨주세요.</p></li><li><span className="step-number" aria-hidden="true">03</span><h3>비용·기간 함께 확인</h3><p>예상 예산과 준비 기간을 확인하고, 시작 계획을 생각해 보세요.</p></li></ol>
        </div></section>
        <section id="estimate" className="wrap section form-layout" aria-labelledby="estimate-title">
          <div className="form-aside"><span className="pill">나에게 맞는 비용·기간 안내</span><h2 id="estimate-title">내 경우엔 얼마,<br />얼마나 걸릴까요?</h2><p>지금까지의 준비 상황만 알려주세요.<br />선택한 조건에 맞는 예상 비용과<br />준비 기간을 함께 안내해 드릴게요.</p><div className="aside-note"><span className="tick" aria-hidden="true">✓</span><span>안내를 받아도 수강 신청이나 결제가 진행되지 않아요.</span></div></div>
          <EstimateForm />
        </section>
      </main>
      <footer className="footer"><div className="wrap footer-inner"><div><a className="logo" href="#main" aria-label="한평생원격교육원 처음으로"><img className="brand-logo" src="/assets/han-lifetime-logo.png" alt="한평생원격교육원" width="708" height="80" /></a><p id="operator-footer">{LIVE ? `운영 · ${LEAD_FORM_CONFIG.operatorName}` : null}</p></div><div className="footer-right"><p>© 한평생원격교육원. All rights reserved.</p></div></div></footer>
      <MobileCta />
    </>
  );
}

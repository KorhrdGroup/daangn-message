'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { LEAD_FORM_CONFIG, LIVE } from '@/lib/config';
import { EDUCATION_OPTIONS, EXPERIENCE_OPTIONS, type Education, type Experience } from '@/lib/options';
import type { SmsStatus } from '@/lib/lead';
import { PHONE_PATTERN, formatPhone } from '@/lib/phone';

/**
 * 비용·기간 신청 폼 — 1단계(학력·수강 경험) → 2단계(성함·번호·동의) → 분석 중 팝업 → 완료 화면.
 * 디자이너 전달본(index.html) 의 폼 · 팝업 · script 를 그대로 옮겼다. 접수는 POST /api/lead (lib/lead.ts).
 */

/** 서버가 알려 준 문자 상태별 완료 문구 — [작은 제목, 제목, 설명] */
const OUTCOME: Record<SmsStatus, [string, string, string]> = {
  sent: ['문자 안내 발송 완료', '예상 비용·기간을 문자로 보내드렸어요.', '남겨주신 번호로 비용·기간 안내 문자를 발송했습니다. 수신 상태에 따라 도착까지 잠시 걸릴 수 있어요.'],
  queued: ['안내 신청 완료', '예상 비용·기간 안내를 신청하셨어요.', '담당자가 확인한 뒤 연락드려 안내해 드릴게요. 더 궁금한 점은 당근 채팅으로 남겨주세요.'],
  failed: ['신청 접수 완료', '신청은 접수됐지만, 문자 발송에 실패했어요.', '다시 신청하지 않으셔도 됩니다. 당근 채팅으로 문자 안내를 받지 못했다고 알려주세요.'],
  not_requested: ['신청 접수 완료', '안내 요청이 접수됐어요.', '담당자가 확인한 뒤 연락드려 안내해 드릴게요. 정확한 안내가 필요하면 당근 채팅으로 문의해 주세요.'],
};
const SMS_STATUSES = Object.keys(OUTCOME) as SmsStatus[];

const EDUCATION_LABEL = Object.fromEntries(EDUCATION_OPTIONS.map((o) => [o.value, o.label])) as Record<Education, string>;
const EXPERIENCE_LABEL = Object.fromEntries(EXPERIENCE_OPTIONS.map((o) => [o.value, o.label])) as Record<Experience, string>;

type Outcome = { label: string; title: string; copy: string; preview: boolean };
type Analysis = { state: 'loading' | 'complete' | 'error'; title: string; copy: string; closeLabel: string; showClose: boolean };

const ANALYSIS_LOADING: Analysis = {
  state: 'loading',
  title: '나만의 사회복지사 비용 기간 분석중...',
  copy: LIVE ? '입력하신 내용을 확인하고 있어요.' : '화면 미리보기입니다. 실제 분석이나 접수는 진행되지 않아요.',
  closeLabel: '확인',
  showClose: false,
};

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const newRequestKey = () =>
  typeof globalThis.crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

export default function EstimateForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [education, setEducation] = useState<Education | ''>('');
  const [experience, setExperience] = useState<Experience | ''>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [stepOneError, setStepOneError] = useState('');
  const [stepTwoError, setStepTwoError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [analysis, setAnalysis] = useState<Analysis>(ANALYSIS_LOADING);
  /** 단계·결과가 바뀐 뒤 옮길 초점 — 그린 다음에 옮긴다 */
  const [focusTarget, setFocusTarget] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const privacyRef = useRef<HTMLDialogElement>(null);
  const analysisRef = useRef<HTMLDialogElement>(null);
  const analysisCloseRef = useRef<HTMLButtonElement>(null);
  const requestKey = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const outcomeRef = useRef<Outcome | null>(null);
  outcomeRef.current = outcome;

  useEffect(() => {
    if (!focusTarget) return;
    document.getElementById(focusTarget)?.focus({ preventScroll: true });
    shellRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'instant' : 'smooth' });
    setFocusTarget(null);
  }, [focusTarget]);

  useEffect(() => {
    if (analysis.showClose) analysisCloseRef.current?.focus({ preventScroll: true });
  }, [analysis]);

  const changeStep = (next: 1 | 2) => {
    setStep(next);
    setFocusTarget(next === 1 ? 'step-one-title' : 'step-two-title');
  };

  const advance = () => {
    if (!education || !experience) {
      setStepOneError('최종학력과 관련 과목 수강 경험을 각각 선택해 주세요.');
      formRef.current?.querySelector<HTMLInputElement>(!education ? '[name="education"]' : '[name="experience"]')?.focus();
      return;
    }
    setStepOneError('');
    changeStep(2);
  };

  const startAnalysis = () => {
    setAnalysis(ANALYSIS_LOADING);
    analysisRef.current?.showModal();
    document.getElementById('analysis-title')?.focus({ preventScroll: true });
  };

  const finishAnalysis = (title: string, copy: string, failed = false) =>
    setAnalysis({ state: failed ? 'error' : 'complete', title, copy, closeLabel: failed ? '다시 확인하기' : '확인', showClose: true });

  const showOutcome = (next: Outcome) => {
    setOutcome(next);
    setName('');
    setPhone('');
    setConsent(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    if (step === 1) {
      advance();
      return;
    }
    const trimmed = name.trim();
    const digits = phone.replace(/\D/g, '');
    if (trimmed.length < 2 || trimmed.length > 40) {
      setStepTwoError('성함을 2자 이상 입력해 주세요.');
      setNameInvalid(true);
      document.getElementById('customer-name')?.focus();
      return;
    }
    if (!PHONE_PATTERN.test(digits)) {
      setStepTwoError('연락받을 수 있는 휴대폰 번호를 확인해 주세요.');
      setPhoneInvalid(true);
      document.getElementById('customer-phone')?.focus();
      return;
    }
    if (!consent) {
      setStepTwoError('예상 비용·준비 기간 안내 및 이번 문의에 대한 후속 상담을 위한 개인정보 수집·이용에 동의해 주세요.');
      document.getElementById('privacy-consent')?.focus();
      return;
    }
    if (honeypotRef.current?.value) return;
    setStepTwoError('');

    const payload = {
      name: trimmed,
      phone: digits,
      education,
      experience,
      requestedInformation: ['estimated_cost', 'estimated_duration'],
      privacyConsent: true,
      inquiryFollowUpRequested: true,
      marketingConsent: false,
      privacyVersion: LEAD_FORM_CONFIG.privacyVersion,
      campaign: LEAD_FORM_CONFIG.campaign,
    };
    submittingRef.current = true;
    setSubmitting(true);
    startAnalysis();
    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!LIVE) {
        await minimumDelay;
        const previewCopy = '화면 체험이 완료됐어요. 입력한 이름·번호는 저장하거나 전송하지 않았어요.';
        showOutcome({ label: '미리보기 완료', title: '완료!', copy: previewCopy, preview: true });
        finishAnalysis('완료!', previewCopy);
        return;
      }
      requestKey.current ||= newRequestKey();
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(LEAD_FORM_CONFIG.endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey.current },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as { accepted?: boolean; smsStatus?: SmsStatus } | null;
      if (!response.ok || !data || data.accepted !== true || !data.smsStatus || !SMS_STATUSES.includes(data.smsStatus)) {
        throw new Error(response.status === 429 ? 'rate_limit' : 'request_failed');
      }
      const [label, title, copy] = OUTCOME[data.smsStatus];
      await minimumDelay;
      showOutcome({ label, title, copy, preview: false });
      finishAnalysis(data.smsStatus === 'failed' ? '접수 완료' : '완료!', `${title} ${copy}`, data.smsStatus === 'failed');
      requestKey.current = null;
    } catch (error) {
      await minimumDelay;
      const errorCopy =
        error instanceof Error && error.name === 'AbortError'
          ? '응답이 지연되어 접수 여부를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.'
          : error instanceof Error && error.message === 'rate_limit'
            ? '요청이 많아 잠시 후 다시 시도해 주세요.'
            : '접수 결과를 확인하지 못했어요. 잠시 후 다시 시도하거나 당근 채팅으로 문의해 주세요.';
      setStepTwoError(errorCopy);
      finishAnalysis('접수를 확인하지 못했어요.', errorCopy, true);
    } finally {
      clearTimeout(timeout);
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const onPhoneChange = (value: string) => {
    setPhone(formatPhone(value.replace(/\D/g, '').slice(0, 11)));
    setPhoneInvalid(false);
  };

  const onPrivacyClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = privacyRef.current;
    if (!dialog || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  };

  const onAnalysisClosed = () => {
    if (outcomeRef.current) setFocusTarget('outcome-title');
    else submitRef.current?.focus({ preventScroll: true });
  };

  const restart = () => {
    formRef.current?.reset();
    requestKey.current = null;
    setEducation('');
    setExperience('');
    setName('');
    setPhone('');
    setConsent(false);
    setOutcome(null);
    setStepOneError('');
    setStepTwoError('');
    setNameInvalid(false);
    setPhoneInvalid(false);
    changeStep(1);
  };

  return (
    <>
      <div className="form-shell" id="form-shell" ref={shellRef}>
        <div className="form-status" id="form-status" hidden={!!outcome}>
          <span className="step-label" id="step-label">
            {step === 1 ? '1 / 2 · 내 준비 상황' : '2 / 2 · 연락받을 정보'}
          </span>
          <div className="step-track" aria-hidden="true">
            <span className="active"></span>
            <span id="step-track-second" className={step === 2 ? 'active' : undefined}></span>
          </div>
        </div>
        <form
          id="estimate-form"
          ref={formRef}
          noValidate
          hidden={!!outcome}
          aria-busy={submitting || undefined}
          onSubmit={onSubmit}
          onInput={() => {
            if (!submittingRef.current) requestKey.current = null;
          }}
        >
          <section id="step-one" aria-labelledby="step-one-title" hidden={step !== 1}>
            <h3 id="step-one-title" tabIndex={-1}>지금의 상황을 알려주세요.</h3>
            <p className="form-intro">잘 모르시는 항목은 편하게 선택하셔도 괜찮아요.</p>
            <fieldset className="fieldset">
              <legend>최종학력을 선택해 주세요</legend>
              <div className="option-grid">
                {EDUCATION_OPTIONS.map((o) => (
                  <label className="option" key={o.value}>
                    <input type="radio" name="education" value={o.value} required checked={education === o.value} disabled={submitting} onChange={() => setEducation(o.value)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="fieldset">
              <legend>사회복지 관련 과목을 들어보셨나요?</legend>
              <div className="option-grid experience">
                {EXPERIENCE_OPTIONS.map((o) => (
                  <label className="option" key={o.value}>
                    <input type="radio" name="experience" value={o.value} required checked={experience === o.value} disabled={submitting} onChange={() => setExperience(o.value)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="error" id="step-one-error" role="alert" hidden={!stepOneError}>
              {stepOneError}
            </p>
            <div className="form-actions">
              <button type="button" className="button" id="next-step" disabled={submitting} onClick={advance}>
                다음
              </button>
            </div>
            <p className="form-hint">내게 맞는 비용과 기간을 안내해 드려요.</p>
          </section>
          <section id="step-two" aria-labelledby="step-two-title" hidden={step !== 2}>
            <h3 id="step-two-title" tabIndex={-1}>비용과 기간을 함께 받아보세요.</h3>
            <p className="form-intro">기재하신 내용을 분석 후 개인별로 비용 준비기간을 알려드릴게요.</p>
            <div className="selection-summary" id="selection-summary">
              {education && <span>{EDUCATION_LABEL[education]}</span>}
              {experience && <span>{EXPERIENCE_LABEL[experience]}</span>}
            </div>
            <p className="preview-notice" id="preview-notice" hidden={LIVE}>
              현재는 미리보기입니다. 입력한 이름·번호는 저장되거나 전송되지 않습니다.
            </p>
            <label className="input-field" htmlFor="customer-name">
              성함
              <input
                className="text-input"
                id="customer-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={40}
                placeholder="성함을 입력해 주세요"
                aria-describedby="step-two-error"
                aria-invalid={nameInvalid || undefined}
                value={name}
                disabled={submitting}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameInvalid(false);
                }}
              />
            </label>
            <label className="input-field" htmlFor="customer-phone">
              휴대폰 번호
              <input
                className="text-input"
                id="customer-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={13}
                placeholder="010-0000-0000"
                aria-describedby="step-two-error"
                aria-invalid={phoneInvalid || undefined}
                value={phone}
                disabled={submitting}
                onChange={(e) => onPhoneChange(e.target.value)}
              />
            </label>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="company-site">
                회사 홈페이지
                <input id="company-site" name="company_site" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
              </label>
            </div>
            <div className="consents">
              <label className="consent">
                <input type="checkbox" id="privacy-consent" name="privacyConsent" checked={consent} disabled={submitting} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  <b>[필수]</b> 예상 비용·준비 기간 안내 및 이번 문의에 대한 후속 상담을 위한 개인정보 수집·이용 및 안내받은 후 담당자가 개별로 간단 상담 진행에 동의합니다.
                </span>
              </label>
              <button type="button" className="privacy-link" id="privacy-open" disabled={submitting} onClick={() => privacyRef.current?.showModal()}>
                개인정보 수집·이용 내용 보기
              </button>
            </div>
            <p className="error" id="step-two-error" role="alert" hidden={!stepTwoError}>
              {stepTwoError}
            </p>
            <div className="form-actions">
              <button type="button" className="button secondary" id="previous-step" disabled={submitting} onClick={() => changeStep(1)}>
                이전
              </button>
              <button type="submit" className="button" id="submit-button" ref={submitRef} disabled={submitting}>
                {submitting ? '안내 신청 중…' : '나만의 비용 기간 확인하기'}
              </button>
            </div>
            <p className="form-hint" id="submit-hint">
              {LIVE ? '번호를 정확하게 입력해 주세요. 선택한 조건을 바탕으로 안내해 드려요.' : '입력 화면을 체험하실 수 있어요. 실제 접수는 되지 않아요.'}
            </p>
          </section>
        </form>
        <section className="outcome" id="outcome" aria-live="polite" hidden={!outcome}>
          <span className="outcome-icon" id="outcome-icon" aria-hidden="true">
            {outcome?.preview ? '✳' : '✓'}
          </span>
          <div className="eyebrow" id="outcome-label">
            {outcome?.label}
          </div>
          <h3 id="outcome-title" tabIndex={-1}>
            {outcome?.title}
          </h3>
          <p id="outcome-copy">{outcome?.copy}</p>
          <button type="button" className="button secondary full" id="restart" onClick={restart}>
            다시 확인하기
          </button>
        </section>
      </div>

      <dialog className="privacy-dialog" id="privacy-dialog" aria-labelledby="privacy-title" ref={privacyRef} onClick={onPrivacyClick}>
        <h2 id="privacy-title">개인정보 수집·이용 안내</h2>
        <p className="preview-notice" id="privacy-preview" hidden={LIVE}>
          미리보기에서는 정보를 수집하지 않습니다. 실제 운영 전 수집 주체와 보유 기간을 확정해야 합니다.
        </p>
        <dl>
          <dt>수집·이용 주체</dt>
          <dd id="privacy-operator">{LIVE ? LEAD_FORM_CONFIG.operatorName : '실제 수집 주체 확인 후 기재'}</dd>
          <dt>수집 항목</dt>
          <dd>성함, 휴대폰 번호, 최종학력, 관련 과목 수강 경험</dd>
          <dt>이용 목적</dt>
          <dd>
            선택한 조건에 따른 예상 비용·준비 기간 산정 및 안내, 신청하신 사회복지사 과정 문의에 대한 전화·문자 답변과 후속 상담. 이 동의는 별도의 홍보·광고 수신 동의로 사용하지 않습니다.
          </dd>
          <dt>연락 방법</dt>
          <dd>비용·기간 안내 후 전화 또는 문자로 이번 문의에 대한 추가 상담 안내를 드릴 수 있습니다.</dd>
          <dt>보유·이용 기간</dt>
          <dd id="privacy-retention">{LIVE ? LEAD_FORM_CONFIG.retentionPeriod : '실제 운영 기준 설정 예정'}</dd>
          <dt>동의 거부 안내</dt>
          <dd>
            동의를 거부할 수 있습니다. 거부 시 이 신청서를 통한 비용·기간 및 상담 안내가 제한됩니다. 이미 신청한 상담의 추가 연락 중단은 연락한 담당자에게 요청하실 수 있습니다.
          </dd>
        </dl>
        <form method="dialog">
          <button className="button full">확인했어요</button>
        </form>
      </dialog>

      <dialog
        className="analysis-dialog"
        id="analysis-dialog"
        aria-labelledby="analysis-title"
        aria-describedby="analysis-copy"
        data-state={analysis.state}
        ref={analysisRef}
        onCancel={(e) => {
          if (submittingRef.current) e.preventDefault();
        }}
        onClose={onAnalysisClosed}
      >
        <span className="analysis-preview" id="analysis-preview" hidden={LIVE}>
          미리보기
        </span>
        <div className="analysis-visual" aria-hidden="true">
          <span className="analysis-spinner" id="analysis-spinner" hidden={analysis.state !== 'loading'}></span>
          <span className="analysis-result" id="analysis-result" hidden={analysis.state === 'loading'}>
            {analysis.state === 'error' ? '!' : '✓'}
          </span>
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <h2 id="analysis-title" tabIndex={-1}>
            {analysis.title}
          </h2>
          <p id="analysis-copy">{analysis.copy}</p>
        </div>
        <button type="button" className="button full" id="analysis-close" ref={analysisCloseRef} hidden={!analysis.showClose} onClick={() => analysisRef.current?.close()}>
          {analysis.closeLabel}
        </button>
      </dialog>
    </>
  );
}

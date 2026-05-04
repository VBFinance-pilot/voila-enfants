import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './Contact.css';

export default function Contact() {
  const { t, lang } = useLang();
  const ref = useReveal();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.target;
    const data = {
      from_name: `${form.lastName.value} ${form.firstName.value}`.trim(),
      from_email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMsg(result.error || (lang === 'ja' ? '送信に失敗しました。' : 'Failed to send.'));
      }
    } catch {
      setStatus('error');
      setErrorMsg(lang === 'ja' ? 'ネットワークエラーが発生しました。' : 'Network error. Please try again.');
    }
  };

  const btnText = () => {
    switch (status) {
      case 'loading': return lang === 'ja' ? '送信中...' : 'Sending...';
      case 'success': return t('contact.submitSuccess');
      default: return t('contact.submitBtn');
    }
  };

  const btnStyle = () => {
    if (status === 'success') return { background: '#2E9E6A' };
    if (status === 'error') return { background: '#D32F2F' };
    return undefined;
  };

  return (
    <section id="contact" ref={ref}>
      <div className="container" style={{ paddingTop: 50 }}>
        <div className="contact-layout">
          <div className="reveal">
            <h2 className="contact-title">{t('contact.title')}</h2>
            <p className="contact-intro">{t('contact.intro')}</p>

            <div className="cinfo-item">
              <div className="cinfo-icon">✉️</div>
              <div>
                <span className="cinfo-label">{t('contact.emailLabel')}</span>
                <div className="cinfo-value">
                  <a href="mailto:contact-voilaJP@protonmail.com">contact-voilaJP@protonmail.com</a>
                </div>
              </div>
            </div>

            <div className="cinfo-item">
              <div className="cinfo-icon">📞</div>
              <div>
                <span className="cinfo-label">{t('contact.phoneLabel')}</span>
                <div className="cinfo-value">
                  <a href="tel:09060090792">090-6009-0792</a>
                </div>
              </div>
            </div>

            <div className="cinfo-item">
              <div className="cinfo-icon">💬</div>
              <div>
                <span className="cinfo-label">{t('contact.lineLabel')}</span>
                <div className="cinfo-value">{t('contact.lineSub')}</div>
              </div>
            </div>

            <a
              href="https://lin.ee/PXNYpdO"
              target="_blank"
              rel="noopener noreferrer"
              className="line-direct-btn"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              <span>{t('contact.lineDirectBtn')}</span>
            </a>

            <div className="qr-section">
              <img src="/qr-line.png" alt="LINE QR Code" className="qr-img" />
              <p className="qr-text">{t('contact.qr')}</p>
            </div>

            <div style={{ marginTop: 28 }}>
              <a href="#contact" className="btn-primary">
                <span>{t('contact.ctaBtn')}</span>
              </a>
            </div>
          </div>

          <div className="cform reveal reveal-d1">
            <h3>{t('contact.formTitle')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="frow">
                <div className="fg">
                  <label>{t('contact.formLast')}</label>
                  <input name="lastName" type="text" placeholder={t('contact.phLast')} required />
                </div>
                <div className="fg">
                  <label>{t('contact.formFirst')}</label>
                  <input name="firstName" type="text" placeholder={t('contact.phFirst')} required />
                </div>
              </div>
              <div className="fg">
                <label>{t('contact.formEmail')}</label>
                <input name="email" type="email" placeholder="votre@email.com" required />
              </div>
              <div className="fg">
                <label>{t('contact.formMessage')}</label>
                <textarea name="message" placeholder={t('contact.phMessage')} required />
              </div>
              {status === 'error' && (
                <p className="form-error">{errorMsg}</p>
              )}
              <button
                type="submit"
                className="fsubmit"
                disabled={status === 'loading'}
                style={btnStyle()}
              >
                {btnText()}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

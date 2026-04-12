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

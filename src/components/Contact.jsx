import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useReveal } from './useReveal';
import './Contact.css';

export default function Contact() {
  const { t } = useLang();
  const ref = useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      e.target.reset();
    }, 3500);
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
                  <input type="text" placeholder={t('contact.phLast')} required />
                </div>
                <div className="fg">
                  <label>{t('contact.formFirst')}</label>
                  <input type="text" placeholder={t('contact.phFirst')} required />
                </div>
              </div>
              <div className="fg">
                <label>{t('contact.formEmail')}</label>
                <input type="email" placeholder="votre@email.com" required />
              </div>
              <div className="fg">
                <label>{t('contact.formMessage')}</label>
                <textarea placeholder={t('contact.phMessage')} required />
              </div>
              <button
                type="submit"
                className="fsubmit"
                style={submitted ? { background: '#2E9E6A' } : undefined}
              >
                {submitted ? t('contact.submitSuccess') : t('contact.submitBtn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useLang } from '../contexts/LanguageContext';
import pricingData from '../data/pricing.json';
import { useReveal } from './useReveal';
import './Pricing.css';

export default function Pricing() {
  const { lang, t } = useLang();
  const ref = useReveal();
  const extras = pricingData.extras[lang];

  return (
    <section id="pricing" ref={ref}>
      <div className="container">
        <div className="pricing-intro reveal">
          <span className="tag">{t('pricing.tag')}</span>
          <h2 className="sec-title-ja">{t('pricing.title')}</h2>
          <div className="bar center" />
          <p dangerouslySetInnerHTML={{ __html: t('pricing.intro') }} />
          <div className="free-badge">{t('pricing.freeBadge')}</div>
          <div className="unlim-box">
            <p>{t('pricing.unlimTitle')}</p>
            <p>{t('pricing.unlimBody')}</p>
          </div>
        </div>

        <div className="pricing-labels reveal">
          <div className="pricing-label-item">
            <div className="pricing-label-title">{t('pricing.enrollment')}</div>
            <div className="pricing-label-value">{t('pricing.free')}</div>
          </div>
          <div className="pricing-label-item">
            <div className="pricing-label-title">{t('pricing.materials')}</div>
            <div className="pricing-label-value">{t('pricing.free')}</div>
          </div>
        </div>

        <div className="price-cards reveal">
          {pricingData.cards.map((card, i) => (
            <div key={i} className={`pcard ${card.featured ? 'feat' : ''}`}>
              <div className="pcard-amt">{card.amount}</div>
              <div className="pcard-name">{card.name[lang]}</div>
              <div className="pcard-type">{card.type[lang]}</div>
            </div>
          ))}
        </div>

        <p className="pink-t reveal" style={{ textAlign: 'center', fontSize: '0.86rem', marginBottom: 36 }}>
          {t('pricing.note')}
        </p>

        <div className="price-extras reveal">
          {extras.map((group, i) => (
            <div key={i} className="pex-card">
              {group.items.map((item, j) => (
                <div key={j} style={j > 0 ? { marginTop: 20 } : undefined}>
                  <h3>{item.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="trial-banner reveal">
          <h3>{t('pricing.trialTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('pricing.trialBody') }} />
          <p dangerouslySetInnerHTML={{ __html: t('pricing.trialSibling') }} />
          <div style={{ marginTop: 24 }}>
            <a href="#contact" className="btn-primary">{t('pricing.trialCta')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

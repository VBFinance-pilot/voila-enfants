import { Helmet } from 'react-helmet-async';
import { useLang } from '../contexts/LanguageContext';
import legalData from '../data/legal.json';
import LegalLayout from './LegalLayout';

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const d = legalData[lang].privacy;

  return (
    <LegalLayout title={d.title} subtitle={d.subtitle} currentPage="privacy">
      <Helmet>
        <title>Privacy Policy | Voilà les enfants</title>
        <meta name="description" content="Privacy policy for Voilà les enfants English school in Kyoto." />
        <link rel="canonical" href="https://www.voila-les-enfants.jp/privacy" />
      </Helmet>
      <Section title={d.intro.title}>
        <p>{d.intro.body}</p>
      </Section>

      <Section title={d.collection.title}>
        <p>{d.collection.body}</p>
        <ul>
          {d.collection.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </Section>

      <Section title={d.purpose.title}>
        <p>{d.purpose.body}</p>
        <ul>
          {d.purpose.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={d.thirdParty.title}>
        <p>{d.thirdParty.body}</p>
        <ul>
          {d.thirdParty.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </Section>

      <Section title={d.rights.title}>
        <p>{d.rights.body}</p>
        <ul>
          {d.rights.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <p>{d.rights.footer}</p>
      </Section>

      <Section title={d.cookies.title}>
        <p>{d.cookies.body}</p>
      </Section>

      <Section title={d.retention.title}>
        <p>{d.retention.body}</p>
      </Section>

      <Section title={d.contact.title}>
        <p>{d.contact.body}</p>
        <div className="legal-email">
          <span>✉️</span>
          <a href={`mailto:${d.contact.email}`}>{d.contact.email}</a>
        </div>
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="legal-section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

import { Helmet } from 'react-helmet-async';
import { useLang } from '../contexts/LanguageContext';
import legalData from '../data/legal.json';
import LegalLayout from './LegalLayout';

export default function Legal() {
  const { lang } = useLang();
  const d = legalData[lang].legal;

  return (
    <LegalLayout title={d.title} subtitle={d.subtitle} currentPage="legal">
      <Helmet>
        <title>Legal Notice | Voilà les enfants</title>
        <meta name="description" content="Legal notice for Voilà les enfants English school in Kyoto." />
        <link rel="canonical" href="https://www.voila-les-enfants.jp/legal" />
      </Helmet>
      <Section title={d.publisher.title}>
        <ul>
          {d.publisher.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </Section>

      <Section title={d.hosting.title}>
        <ul>
          {d.hosting.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </Section>

      <Section title={d.responsible.title}>
        <p>{d.responsible.body}</p>
      </Section>

      <Section title={d.activity.title}>
        <ul>
          {d.activity.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={d.ip.title}>
        <p>{d.ip.body}</p>
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

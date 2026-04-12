import { useLang } from '../contexts/LanguageContext';
import legalData from '../data/legal.json';
import LegalLayout from './LegalLayout';

export default function TermsOfService() {
  const { lang } = useLang();
  const d = legalData[lang].terms;

  return (
    <LegalLayout title={d.title} subtitle={d.subtitle} currentPage="terms">
      <Section title={d.intro.title}>
        <p>{d.intro.body}</p>
      </Section>

      <Section title={d.usage.title}>
        <ul>
          {d.usage.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={d.contactForm.title}>
        <ul>
          {d.contactForm.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={d.ip.title}>
        <p>{d.ip.body}</p>
      </Section>

      <Section title={d.liability.title}>
        <ul>
          {d.liability.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={d.availability.title}>
        <p>{d.availability.body}</p>
      </Section>

      <Section title={d.changes.title}>
        <p>{d.changes.body}</p>
      </Section>

      <Section title={d.law.title}>
        <p>{d.law.body}</p>
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

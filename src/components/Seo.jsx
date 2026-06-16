import { Helmet } from 'react-helmet-async';
import { useLang } from '../contexts/LanguageContext';
import content from '../data/content.json';

const SITE_URL = 'https://www.voila-les-enfants.jp';
const OG_IMAGE = `${SITE_URL}/logo.png`;

// Per-page SEO driven by useLang() — title/description follow the active
// language (ja/en) and come from content.json (no hardcoded copy).
export default function Seo({ page, path = '/' }) {
  const { lang } = useLang();
  const seo = content[lang]?.seo?.[page] ?? content.ja.seo[page];
  const url = `${SITE_URL}${path}`;
  const ogLocale = lang === 'ja' ? 'ja_JP' : 'en_US';
  const ogLocaleAlt = lang === 'ja' ? 'en_US' : 'ja_JP';

  return (
    <Helmet>
      <html lang={lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={url} />

      {/* hreflang — single URL serves both languages */}
      <link rel="alternate" hrefLang="ja" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Voilà les enfants" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}

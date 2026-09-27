import nodemailer from 'nodemailer';
import { LOGO_PNG_BASE64 } from './_logo.js';

// Brand tokens — same as the site (src/site/site.css).
const C = {
  linen: '#F7F3EC',
  cream: '#FFFDF9',
  ink: '#1F1A17',
  muted: '#6F655D',
  line: '#E6DDD0',
  wine: '#6B1238',
  brass: '#7D6235',
};
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const LANG_LABEL = { ja: '日本語', en: 'English', fr: 'Français' };

const clean = (v, max = 200) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const from_name = clean(body.from_name, 120);
  const from_email = clean(body.from_email, 200);
  const message = String(body.message ?? '').slice(0, 5000);
  const topic = clean(body.topic, 80);
  const topicJa = clean(body.topic_ja, 80);
  const lang = LANG_LABEL[body.lang] || '';
  const details = (Array.isArray(body.details) ? body.details : [])
    .slice(0, 10)
    .map((d) => ({ k: clean(d?.k, 60), v: clean(d?.v, 300) }))
    .filter((d) => d.k && d.v);

  if (!from_name || !from_email || !message.trim()) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from_email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const sentAt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Asia/Tokyo', dateStyle: 'full', timeStyle: 'short',
  }).format(new Date());

  const row = (k, v) => `
          <tr>
            <td style="padding:14px 0;border-top:1px solid ${C.line};font:700 11px/1.4 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${C.brass};width:130px;vertical-align:top;">${k}</td>
            <td style="padding:14px 0;border-top:1px solid ${C.line};font:400 15px/1.5 ${SANS};color:${C.ink};vertical-align:top;">${v}</td>
          </tr>`;

  const rows = [
    row('Nom', escapeHtml(from_name)),
    row('E-mail', `<a href="mailto:${escapeHtml(from_email)}" style="color:${C.wine};text-decoration:underline;">${escapeHtml(from_email)}</a>`),
    ...details.map((d) => row(escapeHtml(d.k), escapeHtml(d.v))),
    lang ? row('Langue du site', lang) : '',
  ].join('');

  const topicBlock = topic ? `
        <tr>
          <td style="padding:0 40px 8px;">
            <div style="border:1px solid #D9C9AE;border-left:3px solid ${C.wine};border-radius:12px;background:#FBF7F0;padding:16px 20px;">
              <div style="font:700 11px/1.4 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${C.brass};">Au sujet de</div>
              <div style="font:600 24px/1.25 ${SERIF};color:${C.wine};margin-top:4px;">${escapeHtml(topic)}</div>
              ${topicJa && topicJa !== topic ? `<div style="font:400 13px/1.5 ${SANS};color:${C.muted};margin-top:2px;">${escapeHtml(topicJa)}</div>` : ''}
            </div>
          </td>
        </tr>` : '';

  const replySubject = encodeURIComponent(`Re: ${topic || 'Voilà les enfants'}`);

  const htmlBody = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${C.linen};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.linen};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.cream};border:1px solid ${C.line};border-radius:20px;">
        <tr>
          <td align="center" style="padding:40px 40px 8px;">
            <img src="cid:logo" width="160" alt="Voilà les enfants" style="display:block;width:160px;height:auto;border:0;font:600 26px ${SERIF};color:${C.wine};">
            <div style="font:700 10px/1.6 ${SANS};letter-spacing:.28em;color:${C.brass};margin-top:14px;">ACTIVITY LANGUAGE SCHOOL · KYOTO</div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 40px 28px;">
            <div style="width:40px;height:1px;background:${C.brass};margin:0 auto 22px;"></div>
            <div style="font:600 30px/1.2 ${SERIF};color:${C.ink};">Nouveau message du site</div>
            <div style="font:400 13px/1.6 ${SANS};color:${C.muted};margin-top:6px;">${escapeHtml(sentAt)} · heure du Japon</div>
          </td>
        </tr>
        ${topicBlock}
        <tr>
          <td style="padding:16px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 40px 0;">
            <div style="border-top:1px solid ${C.line};padding-top:20px;font:700 11px/1.4 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${C.brass};">Message</div>
            <div style="font:400 16px/1.7 ${SANS};color:${C.ink};white-space:pre-wrap;margin-top:10px;">${escapeHtml(message)}</div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:32px 40px 40px;">
            <a href="mailto:${escapeHtml(from_email)}?subject=${replySubject}" style="display:inline-block;background:${C.wine};color:#ffffff;font:700 15px/1 ${SANS};text-decoration:none;padding:16px 32px;border-radius:999px;">Répondre à ${escapeHtml(from_name)}</a>
          </td>
        </tr>
      </table>
      <div style="font:400 12px/1.6 ${SANS};color:${C.muted};margin-top:20px;">Envoyé depuis le formulaire de contact de voila-les-enfants.jp</div>
    </td></tr>
  </table>
</body>
</html>`;

  const textBody = [
    'Nouveau message du site — Voilà les enfants',
    sentAt + ' (heure du Japon)',
    '',
    topic ? `Au sujet de : ${topic}${topicJa && topicJa !== topic ? ` / ${topicJa}` : ''}` : null,
    `Nom : ${from_name}`,
    `E-mail : ${from_email}`,
    ...details.map((d) => `${d.k} : ${d.v}`),
    lang ? `Langue du site : ${lang}` : null,
    '',
    message,
  ].filter((l) => l !== null).join('\n');

  try {
    await transporter.sendMail({
      from: `"Voilà les enfants" <${process.env.SMTP_USER}>`,
      replyTo: `"${from_name.replace(/"/g, '')}" <${from_email}>`,
      to: process.env.CONTACT_EMAIL_TO,
      subject: topic
        ? `[Voilà les enfants] ${topic} — ${from_name}`
        : `[Voilà les enfants] Message de ${from_name}`,
      html: htmlBody,
      text: textBody,
      attachments: [{
        filename: 'logo.png',
        content: Buffer.from(LOGO_PNG_BASE64, 'base64'),
        cid: 'logo',
        contentType: 'image/png',
      }],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

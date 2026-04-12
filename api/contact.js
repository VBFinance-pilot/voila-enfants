import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, from_email, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from_email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FFF8F5; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #8B1A4A; font-size: 24px; margin: 0;">Voilà les enfants</h1>
        <p style="color: #C4547A; font-size: 14px; margin: 4px 0 0;">New contact form message</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(139,26,74,0.08);">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 12px; font-weight: 700; color: #8B1A4A; font-size: 14px; width: 100px; vertical-align: top;">Name</td>
            <td style="padding: 8px 12px; color: #1E1E1E; font-size: 14px;">${escapeHtml(from_name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 700; color: #8B1A4A; font-size: 14px; vertical-align: top;">Email</td>
            <td style="padding: 8px 12px; color: #1E1E1E; font-size: 14px;"><a href="mailto:${escapeHtml(from_email)}" style="color: #E8186C;">${escapeHtml(from_email)}</a></td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 16px 12px 8px; border-top: 1px solid #F0E0EB; font-weight: 700; color: #8B1A4A; font-size: 14px;">Message</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px 12px; color: #555; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${escapeHtml(message)}</td>
          </tr>
        </table>
      </div>
      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
        Sent from voila-les-enfants.jp contact form
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Voilà les enfants" <${process.env.SMTP_USER}>`,
      replyTo: `"${from_name}" <${from_email}>`,
      to: process.env.CONTACT_EMAIL_TO,
      subject: `[Voilà les enfants] Message de ${from_name}`,
      html: htmlBody,
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

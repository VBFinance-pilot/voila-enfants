import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import QRCodeStyling from 'qr-code-styling';
import './BusinessCards.css';

const SCALE = 3; // 3x for ~300 DPI at print size
const W = 1004;  // 85mm at 300dpi
const H = 650;   // 55mm at 300dpi

export default function BusinessCards() {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const qrRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!qrRef.current) return;
    const qr = new QRCodeStyling({
      width: 140,
      height: 140,
      data: 'https://www.voila-les-enfants.jp',
      type: 'svg',
      margin: 4,
      dotsOptions: { color: '#8B1A4A', type: 'rounded' },
      cornersSquareOptions: { color: '#6d1439', type: 'extra-rounded' },
      cornersDotOptions: { color: '#E8186C', type: 'dot' },
      backgroundOptions: { color: '#FFFFFF' },
      image: '/logo.png',
      imageOptions: { crossOrigin: 'anonymous', margin: 3, imageSize: 0.25 },
      qrOptions: { errorCorrectionLevel: 'H' },
    });
    qrRef.current.innerHTML = '';
    qr.append(qrRef.current);
  }, []);

  const download = async (ref, name) => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const url = await toPng(ref.current, {
        width: W, height: H, pixelRatio: SCALE,
        style: { transform: 'none', width: W + 'px', height: H + 'px' },
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
    } catch (err) { console.error('Download failed', err); }
    setDownloading(false);
  };

  return (
    <div className="bc-page">
      <h1 className="bc-page-title">Business Cards</h1>
      <p className="bc-page-sub">85 x 55 mm &middot; High resolution</p>

      {/* ===== FRONT ===== */}
      <div className="bc-section">
        <h2>Recto</h2>
        <div className="bc-wrapper">
          <div className="bc-card bc-front" ref={frontRef}>
            {/* Watercolor blobs */}
            <div className="wc wc-1" />
            <div className="wc wc-2" />
            <div className="wc wc-3" />
            <div className="wc wc-4" />

            {/* Top bar */}
            <div className="bc-f-top">
              <img src="/logo.png" alt="Voila" className="bc-f-logo" />
              <div className="bc-f-flags">🇺🇸 🇫🇷 🇯🇵</div>
            </div>

            {/* Main title */}
            <div className="bc-f-title-wrap">
              <div className="bc-f-badge">NEW</div>
              <h2 className="bc-f-title">生徒募集中 !</h2>
              <p className="bc-f-title-en">Now Enrolling Students!</p>
            </div>

            {/* Services */}
            <div className="bc-f-services">
              <div className="bc-f-srv"><span className="bc-f-dot" />English Camp</div>
              <div className="bc-f-srv"><span className="bc-f-dot" />Online Lessons</div>
              <div className="bc-f-srv"><span className="bc-f-dot" />Homestay</div>
              <div className="bc-f-srv"><span className="bc-f-dot" />Face to Face</div>
              <div className="bc-f-srv"><span className="bc-f-dot" />Oyako Hiroba</div>
              <div className="bc-f-srv"><span className="bc-f-dot" />Events</div>
            </div>

            {/* Benefits */}
            <div className="bc-f-benefits">
              <span className="bc-f-check">&#10003; 入会金無料</span>
              <span className="bc-f-check">&#10003; 教材費無料</span>
              <span className="bc-f-check">&#10003; 振替OK</span>
            </div>

            {/* Bottom */}
            <div className="bc-f-bottom">
              <span className="bc-f-url">www.voila-les-enfants.jp</span>
            </div>
          </div>
        </div>
        <button className="bc-dl-btn" disabled={downloading} onClick={() => download(frontRef, 'voila-card-front.png')}>
          {downloading ? 'Generating...' : 'Download Front (PNG)'}
        </button>
      </div>

      {/* ===== BACK ===== */}
      <div className="bc-section">
        <h2>Verso</h2>
        <div className="bc-wrapper">
          <div className="bc-card bc-back" ref={backRef}>
            {/* Subtle watercolor */}
            <div className="wc wc-b1" />
            <div className="wc wc-b2" />

            {/* Logo */}
            <div className="bc-b-logo-wrap">
              <img src="/logo.png" alt="Voila" className="bc-b-logo" />
            </div>

            {/* Founders row */}
            <div className="bc-b-founders">
              <div className="bc-b-founder">
                <div className="bc-b-avatar">
                  <img src="/victor.jpg" alt="Victor" />
                </div>
                <div className="bc-b-name">Victor</div>
                <div className="bc-b-role">Founder</div>
                <div className="bc-b-lang">English / French 🇫🇷</div>
              </div>
              <div className="bc-b-founder">
                <div className="bc-b-avatar">
                  <img src="/maria.jpg" alt="Maria" />
                </div>
                <div className="bc-b-name">Maria</div>
                <div className="bc-b-role">Founder</div>
                <div className="bc-b-lang">English / Japanese 🇯🇵</div>
              </div>
            </div>

            {/* QR + Contact */}
            <div className="bc-b-bottom">
              <div className="bc-b-qr" ref={qrRef} />
              <div className="bc-b-contact">
                <div className="bc-b-hello">Bonjour !</div>
                <div className="bc-b-phone">090-XXXX-XXXX</div>
                <div className="bc-b-cta">お問い合わせはこちら</div>
                <div className="bc-b-site">www.voila-les-enfants.jp</div>
              </div>
            </div>
          </div>
        </div>
        <button className="bc-dl-btn" disabled={downloading} onClick={() => download(backRef, 'voila-card-back.png')}>
          {downloading ? 'Generating...' : 'Download Back (PNG)'}
        </button>
      </div>

      <a href="/" className="bc-back-link">Back to site</a>
    </div>
  );
}

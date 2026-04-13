import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './QRCode.css';

const SITE_URL = 'https://www.voila-les-enfants.jp';

function createQR(size) {
  return new QRCodeStyling({
    width: size,
    height: size,
    data: SITE_URL,
    margin: 12,
    type: 'svg',
    dotsOptions: {
      color: '#8B1A4A',
      type: 'rounded',
    },
    cornersSquareOptions: {
      color: '#6d1439',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#E8186C',
      type: 'dot',
    },
    backgroundOptions: {
      color: '#FFF8F5',
    },
    image: '/logo.png',
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 6,
      imageSize: 0.28,
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
  });
}

export default function QRCode() {
  const displayRef = useRef(null);
  const [qrDisplay, setQrDisplay] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Display QR (300x300)
  useEffect(() => {
    const qr = createQR(300);
    setQrDisplay(qr);
    if (displayRef.current) {
      displayRef.current.innerHTML = '';
      qr.append(displayRef.current);
    }
  }, []);

  const downloadPNG = async () => {
    setDownloading(true);
    try {
      const qrHD = createQR(1000);
      // Small delay for rendering
      await new Promise(r => setTimeout(r, 300));
      await qrHD.download({ name: 'voila-les-enfants-qr', extension: 'png' });
    } catch (err) {
      console.error('PNG download failed', err);
    }
    setDownloading(false);
  };

  const downloadSVG = async () => {
    setDownloading(true);
    try {
      const qrHD = createQR(1000);
      await new Promise(r => setTimeout(r, 300));
      await qrHD.download({ name: 'voila-les-enfants-qr', extension: 'svg' });
    } catch (err) {
      console.error('SVG download failed', err);
    }
    setDownloading(false);
  };

  return (
    <div className="qr-page">
      <div className="qr-card">
        <h1 className="qr-title">Voila les enfants</h1>
        <p className="qr-subtitle">English school in Kyoto</p>

        <div className="qr-container" ref={displayRef} />

        <p className="qr-scan-text">
          Scannez ce code pour visiter notre site
        </p>
        <p className="qr-url">{SITE_URL}</p>

        <div className="qr-actions">
          <button onClick={downloadPNG} disabled={downloading} className="qr-btn qr-btn-primary">
            {downloading ? 'Downloading...' : 'Download PNG (HD)'}
          </button>
          <button onClick={downloadSVG} disabled={downloading} className="qr-btn qr-btn-secondary">
            Download SVG (print)
          </button>
        </div>

        <a href="/" className="qr-back">Back to site</a>
      </div>
    </div>
  );
}

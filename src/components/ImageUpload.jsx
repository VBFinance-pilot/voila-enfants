import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import './ImageUpload.css';

export default function ImageUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(10);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `photos/${fileName}`;

    setProgress(30);

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file, { cacheControl: '31536000', upsert: false });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(70);

    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    const { data: items } = await supabase
      .from('gallery_items')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = items?.length > 0 ? items[0].order_index + 1 : 0;

    const { error: dbError } = await supabase
      .from('gallery_items')
      .insert({ image_url: imageUrl, order_index: nextOrder });

    if (dbError) {
      alert('Database insert failed: ' + dbError.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    setUploading(false);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';

    onUploaded?.();
  };

  return (
    <div className="img-upload">
      <div className="img-upload-area">
        {preview ? (
          <img src={preview} alt="Preview" className="img-upload-preview" />
        ) : (
          <div className="img-upload-placeholder">
            <span>📷</span>
            <p>Select an image</p>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="img-upload-input"
      />
      {preview && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="img-upload-btn"
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload to Gallery'}
        </button>
      )}
      {uploading && (
        <div className="img-upload-progress">
          <div className="img-upload-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

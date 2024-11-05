import { useState } from 'react';
import { csrfFetch } from '../../store/csrf';
import styles from './styles/PhotoUpload.module.css';

function PhotoUpload({ onUploadSuccess, onRemoveImage, images, maxImages }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await csrfFetch('/spot-images/upload', 'POST', formData);

      const data = await response.json();

      onUploadSuccess(data.url);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.imageGrid}>
      {images.map((image, index) => (
        <div key={index} className={styles.imageContainer}>
          <img src={image.url} alt={`Spot image ${index + 1}`} />
          {index === 0 && <span className={styles.previewBadge}>Preview</span>}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRemoveImage(index);
            }}
            className={styles.removeButton}
          >
            ×
          </button>
        </div>
      ))}

      {images.length < maxImages && (
        <div className={styles.addImageBox}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="image-upload"
          />
          {images.length < maxImages && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="image-upload"
                disabled={loading}
              />
              <div
                className={styles.addImageBox}
                onClick={() => document.getElementById('image-upload').click()}
              >
                +
              </div>
            </>
          )}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default PhotoUpload;

import { useSelector } from 'react-redux';
import { useState } from 'react';
import styles from './ImageGallery.module.css';

function ImageGallery() {
  const spot = useSelector((state) => state.spots.currentSpot);
  const images = spot?.SpotImages || [];
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => ({ ...prev, [imageId]: true }));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      {images[0] && (
        <img
          src={images[0].url}
          alt="Main"
          className={`${styles.mainImage} ${
            loadedImages[images[0].id] ? styles.loaded : styles.loading
          }`}
          onLoad={() => handleImageLoad(images[0].id)}
        />
      )}
      <div className={styles.thumbnails}>
        {images.slice(1, 3).map((image, index) => (
          <img
            key={image.id || index}
            src={image.url}
            alt={`Thumbnail ${index + 1}`}
            className={`${styles.thumbnail} ${
              loadedImages[image.id] ? styles.loaded : styles.loading
            }`}
            onLoad={() => handleImageLoad(image.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;

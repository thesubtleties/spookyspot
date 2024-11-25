import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import styles from './styles/ImageGallery.module.css';
import useAlternate from '../../hooks/useAlternate';

function ImageGallery() {
  const spot = useSelector((state) => state.spots.currentSpot);
  const images = spot?.SpotImages || [];
  const [loadedImages, setLoadedImages] = useState({});

  // Preload all images when component mounts
  useEffect(() => {
    if (images.length > 0) {
      images.forEach((image) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => {
          setLoadedImages((prev) => ({
            ...prev,
            [image.id]: true,
          }));
        };
      });
    }
  }, [spot]); // Only run when spot changes

  // Always call hooks, regardless of conditions
  const alternateTop = useAlternate(6000);
  const alternateBottom = useAlternate(6000, 3000);

  // Calculate if we can fade after calling hooks
  const canFadeTop = images.length > 3;
  const canFadeBottom = images.length > 4;

  // Use the results of hooks only if we can fade
  const showAlternateTop = canFadeTop ? alternateTop : false;
  const showAlternateBottom = canFadeBottom ? alternateBottom : false;

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => ({ ...prev, [imageId]: true }));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      {/* Main Image */}
      {images[0] && (
        <img
          src={images[0].url}
          alt="Main"
          className={`${styles.mainImage} ${
            loadedImages[images[0].id] ? styles.loaded : styles.loading
          }`}
          onLoad={() => handleImageLoad(images[0].id)} // Added back for main image
        />
      )}

      {/* Right side images */}
      <div className={styles.thumbnails}>
        {/* Top right images with fade */}
        <div className={styles.fadeContainer}>
          {images[1] && (
            <img
              src={images[1].url}
              alt="Top right primary"
              className={`${styles.thumbnail} ${
                loadedImages[images[1].id] ? styles.loaded : styles.loading
              } ${!showAlternateTop ? styles.fadeImage : ''}`}
            />
          )}
          {canFadeTop && images[3] && (
            <img
              src={images[3].url}
              alt="Top right alternate"
              className={`${styles.thumbnail} ${
                loadedImages[images[3].id] ? styles.loaded : styles.loading
              } ${showAlternateTop ? styles.fadeImage : ''}`}
            />
          )}
        </div>

        {/* Bottom right images with fade */}
        <div className={styles.fadeContainer}>
          {images[2] && (
            <img
              src={images[2].url}
              alt="Bottom right primary"
              className={`${styles.thumbnail} ${
                loadedImages[images[2].id] ? styles.loaded : styles.loading
              } ${!showAlternateBottom ? styles.fadeImage : ''}`}
            />
          )}
          {canFadeBottom && images[4] && (
            <img
              src={images[4].url}
              alt="Bottom right alternate"
              className={`${styles.thumbnail} ${
                loadedImages[images[4].id] ? styles.loaded : styles.loading
              } ${showAlternateBottom ? styles.fadeImage : ''}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default ImageGallery;

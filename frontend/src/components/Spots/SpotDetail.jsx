import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetailsThunk } from '../../store/spots'; // adjust path as needed
import { getReviewsBySpotThunk } from '../../store/reviews'; // adjust path as needed
import ImageGallery from './ImageGallery';
import SpotInfo from './SpotInfo';
import ReviewSection from './ReviewSection';
import styles from './styles/SpotDetail.module.css';
import { fetchSpotData } from '../utils/fetchSpotData';

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchFns = [fetchSpotDetailsThunk, getReviewsBySpotThunk];
    async function laodData() {
      await fetchSpotData(dispatch, spotId, fetchFns);
    }
    laodData();
    setIsLoading(false);
    setError(false);
  }, [dispatch, spotId]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!spot || !spot.name) {
    return <div className={styles.error}>Spot not found</div>;
  }

  return (
    <div className={styles.spotDetail}>
      <div className={styles.spotHeader}>
        <h1 className={styles.spotName}>{spot.name}</h1>
        <p className={styles.spotLocation}>
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>
      <ImageGallery />
      <SpotInfo />
      <ReviewSection />
    </div>
  );
}

export default SpotDetail;

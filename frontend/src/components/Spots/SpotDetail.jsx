import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetailsThunk } from '../../store/spots'; // adjust path as needed
import { getReviewsBySpotThunk } from '../../store/reviews'; // adjust path as needed
import ImageGallery from './ImageGallery';
import SpotInfo from './SpotInfo';
import ReviewSection from './ReviewSection';
import styles from './SpotDetail.module.css';

function SpotDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(fetchSpotDetailsThunk(id));
        await dispatch(getReviewsBySpotThunk(id));
      } catch (err) {
        setError('Failed to load spot details. Please try again.');
        console.error('Error fetching spot details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id]);

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

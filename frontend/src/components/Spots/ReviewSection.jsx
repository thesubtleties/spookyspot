import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReviewCard from '../Reviews/ReviewCard';
import OpenModalButton from '../OpenModalButton';
import AddReviewModal from '../Reviews/AddReviewModal';
import { getReviewsBySpotThunk } from '../../store/reviews';
import styles from './ReviewSection.module.css';

function ReviewSection() {
  const dispatch = useDispatch();
  const spotId = useSelector((state) => state.spots.currentSpot.id);
  const allReviews = useSelector((state) => state.reviews.reviews);
  const currentUser = useSelector((state) => state.session.user);
  const currentSpot = useSelector((state) => state.spots.currentSpot);
  const [localUpdateTrigger, setLocalUpdateTrigger] = useState(0);

  useEffect(() => {
    dispatch(getReviewsBySpotThunk(spotId));
  }, [dispatch, spotId, localUpdateTrigger]);

  const sortedReviews = allReviews
    .filter((review) => review.spotId === spotId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const userHasReviewed =
    currentUser &&
    sortedReviews.some((review) => review.userId === currentUser.id);
  const isOwner =
    currentUser && currentSpot && currentUser.id === currentSpot.ownerId;
  const showReviewButton = currentUser && !userHasReviewed && !isOwner;

  const handleReviewAdded = () => {
    setLocalUpdateTrigger((prev) => prev + 1); // This will trigger a re-render and a new fetch
  };

  if (sortedReviews.length === 0) {
    if (currentUser && !isOwner) {
      return (
        <div className={styles.reviews}>
          <h2>Be the first to post a review!</h2>
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={
              <AddReviewModal
                spotId={spotId}
                onReviewAdded={handleReviewAdded}
              />
            }
            className={styles.reviewButton}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.reviews}>
          <h2>No Reviews Yet</h2>
        </div>
      );
    }
  }

  return (
    <div className={styles.reviews}>
      <h2>
        {sortedReviews.length}{' '}
        {sortedReviews.length === 1 ? 'Review' : 'Reviews'}
      </h2>
      {sortedReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {showReviewButton && (
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={
            <AddReviewModal spotId={spotId} onReviewAdded={handleReviewAdded} />
          }
          className={styles.reviewButton}
        />
      )}
    </div>
  );
}

export default ReviewSection;

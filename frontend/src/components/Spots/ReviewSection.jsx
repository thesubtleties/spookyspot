import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReviewCard from '../Reviews/ReviewCard';
import OpenModalButton from '../OpenModalButton';
import AddReviewModal from '../Reviews/AddReviewModal';
import { useMemo } from 'react';

import styles from './styles/ReviewSection.module.css';

function ReviewSection() {
  const { spotId } = useParams();
  const sortedReviews = useSelector((state) => {
    const reviews = state.reviews.reviews;
    return reviews;
  });
  const currentUser = useSelector((state) => state.session.user);
  const currentSpot = useSelector((state) => state.spots.currentSpot);

  const userHasReviewed =
    currentUser &&
    sortedReviews?.some((review) => review.userId === currentUser.id);
  const isOwner =
    currentUser && currentSpot && currentUser.id === currentSpot.ownerId;
  const showReviewButton = currentUser && !userHasReviewed && !isOwner;

  if (sortedReviews.length === 0) {
    if (currentUser && !isOwner) {
      return (
        <div className={styles.reviews}>
          <h2>Be the first to post a review!</h2>
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<AddReviewModal spotId={spotId} />}
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
          modalComponent={<AddReviewModal spotId={spotId} />}
          className={styles.reviewButton}
        />
      )}
    </div>
  );
}

export default ReviewSection;

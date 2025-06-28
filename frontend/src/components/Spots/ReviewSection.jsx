import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReviewCard from '../Reviews/ReviewCard';
import OpenModalButton from '../OpenModalButton';
import AddReviewModal from '../Reviews/AddReviewModal';
import { getReviewsBySpotThunk } from '../../store/reviews';
import { fetchSpotDetailsThunk } from '../../store/spots';
import { fetchSpotData } from '../utils/fetchSpotData';
import { TbPumpkinScary } from 'react-icons/tb';
import { formatRating } from '../utils/ratingFormatter';
import { calculateRating } from '../utils/calculateRating';

import styles from './styles/ReviewSection.module.css';

function ReviewSection() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const sortedReviews = useSelector((state) => {
    if (!state.reviews.reviews) {
      fetchSpotData(dispatch, spotId, [
        getReviewsBySpotThunk,
        fetchSpotDetailsThunk,
      ]);
      return [];
    }

    const reviews = state.reviews.reviews;
    if (!reviews) return [];

    return [...reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
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
      <h2 className={styles.reviewHeader}>
        <div className={styles.reviewCount}>
          {sortedReviews.length}{' '}
          {sortedReviews.length === 1 ? 'Review' : 'Reviews'}
        </div>
        {sortedReviews.length > 0 && (
          <div className={styles.reviewsRating}>
            <TbPumpkinScary />
            {calculateRating(currentSpot, formatRating)}
          </div>
        )}
      </h2>
      {sortedReviews.map((review) => (
        <ReviewCard key={review.id} review={review} spotId={spotId} />
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

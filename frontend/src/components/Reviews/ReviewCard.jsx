import { useSelector, useDispatch } from 'react-redux';
import { TbPumpkinScary } from 'react-icons/tb';
import { deleteReviewThunk } from '../../store/reviews';
import { fetchSpotDetailsThunk } from '../../store/spots';
import styles from './styles/ReviewCard.module.css';
import { formatDate } from '../utils/formatDate';
import { capitalize } from '../utils/stringFormat';

function ReviewCard({ review, spotId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const isOwner = currentUser && currentUser.id === review.userId;

  if (!review || !review.User) {
    return null;
  }
  // TODO: update to modal
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReviewThunk(review.id));
        await dispatch(fetchSpotDetailsThunk(spotId));
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.userInfo}>
        <h3>{capitalize(review.User.firstName)}</h3>
        <p className={styles.date}>{formatDate(review.createdAt)}</p>
      </div>
      <div className={styles.rating}>
        <span className={styles.stars}>
          {[...Array(5)].map((_, index) => (
            <TbPumpkinScary
              key={index}
              className={
                index < review.stars ? styles.pumpkin : styles.emptyPumpkin
              }
            />
          ))}
        </span>
        <span className={styles.starsText}>
          {review.stars} {review.stars === 1 ? 'pumpkin' : 'pumpkins'}
        </span>
      </div>
      <p className={styles.reviewText}>{review.review}</p>
      {isOwner && (
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete Review
        </button>
      )}
    </div>
  );
}

export default ReviewCard;

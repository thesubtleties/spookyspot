import { useSelector, useDispatch } from 'react-redux';
import { TbPumpkinScary } from 'react-icons/tb';
import { deleteReviewThunk } from '../../store/reviews';
import styles from './ReviewCard.module.css';
import { formatDate } from '../utils/formatDate';

function ReviewCard({ review }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const isOwner = currentUser && currentUser.id === review.userId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReviewThunk(review.id));
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.userInfo}>
        <h3>
          {review.User.firstName} {review.User.lastName}
        </h3>
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
        <span className={styles.starsText}>{review.stars} pumpkins</span>
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

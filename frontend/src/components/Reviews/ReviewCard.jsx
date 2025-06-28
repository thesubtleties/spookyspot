import { useSelector } from 'react-redux';
import { TbPumpkinScary } from 'react-icons/tb';
import OpenDeleteReviewModal from './OpenDeleteReviewModal';
import DeleteModal from '../DeleteModal';
import styles from './styles/ReviewCard.module.css';
import { formatDate } from '../utils/formatDate';
import { capitalize } from '../utils/stringFormat';

function ReviewCard({ review }) {
  const currentUser = useSelector((state) => state.session.user);
  const isOwner = currentUser && currentUser.id === review.userId;

  if (!review || !review.User) {
    return null;
  }

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
        <OpenDeleteReviewModal
          modalComponent={<DeleteModal id={review.id} type={'review'} />}
          itemText={`Delete`}
        />
      )}
    </div>
  );
}

export default ReviewCard;

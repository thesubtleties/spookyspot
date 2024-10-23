import { useSelector } from 'react-redux';
import { selectCurrentSpot } from '../../store/spots';
import styles from './styles/SpotInfo.module.css';
import { formatRating } from '../utils/ratingFormatter';
import { GoDotFill } from 'react-icons/go';

function SpotInfo() {
  const spot = useSelector(selectCurrentSpot);

  const rating = spot.avgStarRating ? formatRating(spot.avgStarRating) : 'New';
  const reviewText = spot.numReviews
    ? `${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`
    : '';

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  return (
    <div className={styles.info}>
      <div className={styles.mainContent}>
        <h2>
          Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
        </h2>
        <p className={styles.description}>{spot.description}</p>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.priceRating}>
          <p className={styles.price}>${spot.price} / night</p>
          <p className={styles.rating}>
            Rating: {rating}
            {spot.numReviews > 0 && (
              <>
                <GoDotFill />
                {reviewText}
              </>
            )}
          </p>
        </div>
        <button onClick={handleReserveClick} className={styles.reserveButton}>
          Reserve
        </button>
      </div>
    </div>
  );
}

export default SpotInfo;

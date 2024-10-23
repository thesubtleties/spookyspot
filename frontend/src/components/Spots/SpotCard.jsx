import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatRating } from '../utils/ratingFormatter';
import { TbPumpkinScary } from 'react-icons/tb';
import { setCurrentSpot, deleteSpotThunk } from '../../store/spots';
import styles from './styles/SpotCard.module.css';

function SpotCard({ id, showEdit = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const spot = useSelector(
    (state) =>
      state.spots.allSpots.find((s) => s.id === id) ||
      state.spots.userSpots.find((s) => s.id === id)
  );

  if (!spot) return null;

  const handleCardClick = () => {
    dispatch(setCurrentSpot(spot));
    navigate(`/spots/${id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch(setCurrentSpot(spot));
    navigate(`/spots/${spot.id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this spot?')) {
      try {
        await dispatch(deleteSpotThunk(id));
        // Optionally add a success message
      } catch (error) {
        console.error('Failed to delete spot:', error);
        // Optionally show an error message
      }
    }
  };

  const renderRatingOrNew = () => {
    if (spot.avgRating && spot.avgRating !== '0.0') {
      return (
        <>
          {formatRating(spot.avgRating)}
          <TbPumpkinScary />
        </>
      );
    } else {
      return <span className={styles.newLabel}>New</span>;
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.tooltip}>{spot.name}</div>
      <div className={styles.card} onClick={handleCardClick}>
        <img src={spot.previewImage} alt={spot.name} className={styles.image} />
        <div className={styles.info}>
          <h3 className={styles.name}>{spot.name}</h3>
          <p className={styles.location}>{`${spot.city}, ${spot.state}`}</p>
          <p className={styles.price}>{`$${spot.price} / night`}</p>
          <p className={styles.avgRating}>{renderRatingOrNew()}</p>
          {showEdit && (
            <div className={styles.buttonContainer}>
              <button onClick={handleEdit} className={styles.editButton}>
                Edit
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpotCard;

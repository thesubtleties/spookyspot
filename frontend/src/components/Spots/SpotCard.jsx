import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatRating } from '../utils/ratingFormatter';
import { TbPumpkinScary } from 'react-icons/tb';
import { setCurrentSpot, deleteSpotThunk } from '../../store/spots';
import DeleteSpotModal from './DeleteSpotModal';
import styles from './styles/SpotCard.module.css';
import OpenDeleteSpotModal from './OpenDeleteSpotModal';

function SpotCard({ id, showEdit = false, className = '', style = {} }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const spot = useSelector((state) =>
    showEdit
      ? state.spots.userSpots.find((s) => s.id === id)
      : state.spots.allSpots.find((s) => s.id === id)
  );

  if (!spot) return null;

  const handleCardClick = () => {
    dispatch(setCurrentSpot(spot));
    navigate(`/spots/${id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    document.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    navigate(`/spots/${spot.id}/edit`);
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
  console.log('Spot in Spot Card', spot);
  return (
    <div className={`${styles.cardWrapper} ${className}`} style={style}>
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
              <OpenDeleteSpotModal
                modalComponent={<DeleteSpotModal spotId={id} />}
                itemText={`Delete`}
                spotId={id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpotCard;

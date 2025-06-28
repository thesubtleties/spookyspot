import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSpotsThunk } from '../../store/spots'; // Adjust the import path as needed
import SpotCard from './SpotCard'; // Adjust the import path as needed
import styles from './styles/AllSpots.module.css';

function AllSpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(fetchAllSpotsThunk());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.spotGrid}>
        {spots.map((spot, index) => (
          <SpotCard
            key={spot.id}
            id={spot.id}
            className={`${styles.spotCard} ${styles[`sway${(index % 3) + 1}`]}`}
            style={{
              animationDelay: `${Math.random() * -5}s`, // Random start time
              animationDuration: `${3 + Math.random() * 2}s`, // Random duration between 3-5s
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AllSpots;

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserSpotsThunk } from '../../store/spots';
import SpotCard from './SpotCard';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import styles from './styles/ManageSpots.module.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector((state) => state.spots.userSpots);
  const user = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dispatch(getUserSpotsThunk())
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error loading spots:', error);
          setIsLoading(false);
        });
    }
  }, [dispatch, user]);

  const handleCreateSpot = () => {
    navigate('/spots/new');
  };

  if (!user) {
    return <div>Please log in to manage your spots.</div>;
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  console.log('Rendering ManageSpots, userSpots:', userSpots);

  return (
    <div className={styles.container}>
      <h1>Manage Your Spots</h1>
      {userSpots && userSpots.length > 0 ? (
        <div className={styles.spotGrid}>
          {userSpots.map((spot) => (
            <SpotCard key={spot.id} id={spot.id} showEdit={true} />
          ))}
        </div>
      ) : (
        <div className={styles.noSpots}>
          <p>You dont have any Spots yet!</p>
          <button onClick={handleCreateSpot} className={styles.createButton}>
            Create a New Spot
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageSpots;

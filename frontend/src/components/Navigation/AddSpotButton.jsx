import { useNavigate } from 'react-router-dom';
import styles from './styles/AddSpotButton.module.css';
import { useDispatch } from 'react-redux';
import { setCurrentSpot } from '../../store/spots';

function AddSpotButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setCurrentSpot(null));

    navigate('/spots/new');
  };

  return (
    <button className={styles.addSpotButton} onClick={handleClick}>
      Add a Spot
    </button>
  );
}

export default AddSpotButton;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddSpotButton.module.css';

function AddSpotButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/spots/new');
  };

  return (
    <button className={styles.addSpotButton} onClick={handleClick}>
      Add a Spot
    </button>
  );
}

export default AddSpotButton;

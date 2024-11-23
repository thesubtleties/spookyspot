import { useState } from 'react';
import { deleteSpotThunk } from '../../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';

import styles from './styles/DeleteSpotModal.module.css';

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.stopPropagation();
    console.log(spotId);
    try {
      await dispatch(deleteSpotThunk(spotId));
    } catch (error) {
      console.error('Failed to delete spot:', error);
    } finally {
      closeModal();
    }
  };

  return (
    <div className={styles.modalContainer}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this spot?</p>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton} onClick={handleDelete}>
          Yes (Delete Spot)
        </button>
        <button className={styles.cancelButton} onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;

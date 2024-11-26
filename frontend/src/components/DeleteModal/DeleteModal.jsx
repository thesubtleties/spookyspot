import { deleteSpotThunk } from '../../store/spots';
import { deleteReviewThunk } from '../../store/reviews'; // Add this import
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

import styles from './styles/DeleteModal.module.css';

function DeleteModal({ id, type }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      if (type === 'spot') {
        await dispatch(deleteSpotThunk(id));
      } else if (type === 'review') {
        await dispatch(deleteReviewThunk(id));
      }
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    } finally {
      closeModal();
    }
  };

  return (
    <div className={styles.modalContainer}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this {type}?</p>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton} onClick={handleDelete}>
          Yes (Delete {type})
        </button>
        <button className={styles.cancelButton} onClick={closeModal}>
          No (Keep {type})
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;

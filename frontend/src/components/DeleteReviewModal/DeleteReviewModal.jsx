import { useModal } from '../../context/Modal';
import { csrfFetch } from '../../store/csrf';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId, onReviewDelete }) {
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onReviewDelete(reviewId);
        closeModal();
      } else {
        // Handle errors if needed
      }
    } catch (error) {
      // Handle errors if needed
    }
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-modal-buttons">
        <button onClick={handleDelete} className="confirm-delete-button">
          Yes (Delete Review)
        </button>
        <button onClick={closeModal} className="cancel-delete-button">
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
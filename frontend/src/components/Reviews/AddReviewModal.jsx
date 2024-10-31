import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addReviewThunk } from '../../store/reviews';
import { useModal } from '../../context/Modal';
import { TbPumpkinScary } from 'react-icons/tb';
import styles from './styles/AddReviewModal.module.css';

function AddReviewModal({ spotId }) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addReviewThunk({
          review,
          stars,
          spotId,
        })
      );
      closeModal();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2>How was your stay?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here..."
          className={styles.reviewInput}
        />
        <div className={styles.pumpkinRating}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TbPumpkinScary
              key={value}
              className={
                value <= stars ? styles.pumpkinFilled : styles.pumpkinEmpty
              }
              onClick={() => setStars(value)}
            />
          ))}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={stars === 0 || review.length < 10}
        >
          Submit Your Review
        </button>
      </form>
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
}

export default AddReviewModal;

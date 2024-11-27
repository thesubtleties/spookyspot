import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { csrfFetch } from '../../store/csrf';
import './CreateReviewModal.css';

function CreateReviewModal({ spotId, onReviewSubmit }) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          review,
          stars
        })
      });

      if (response.ok) {
        const data = await response.json();
        await onReviewSubmit(data);
        closeModal();
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.message || 'An error occurred' });
        }
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while submitting your review' });
    }
  };

  return (
    <div className="review-modal">
      <h2>How was your stay?</h2>
      {errors.submit && <p className="error">{errors.submit}</p>}
      
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
        />
        {errors.review && <p className="error">{errors.review}</p>}

        <div className="stars-input">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`star ${num <= stars ? 'filled' : ''}`}
              onClick={() => setStars(num)}
              onMouseEnter={() => setStars(num)}
            >
              ★
            </span>
          ))}
          <span className="stars-text">Stars</span>
        </div>
        {errors.stars && <p className="error">{errors.stars}</p>}

        <button
          type="submit"
          disabled={review.length < 10 || stars === 0}
          className="submit-review-button"
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default CreateReviewModal;
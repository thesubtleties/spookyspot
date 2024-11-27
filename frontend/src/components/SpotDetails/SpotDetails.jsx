import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SpotDetails.css';
import { useDispatch, useSelector } from 'react-redux';

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch spot details
        const spotResponse = await fetch(`/api/spots/${spotId}`);
        const spotData = await spotResponse.json();
        
        // Fetch reviews
        const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
        const reviewsData = await reviewsResponse.json();
        
        setSpot(spotData);
        setReviews(reviewsData.Reviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [spotId]);

  if (isLoading || !spot) return <div>Loading...</div>;

  return (
    <div className="spot-details">
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>
      </div>

      <div className="spot-images">
        <div className="main-image">
          <img src={spot.SpotImages[0]?.url || '/favicon.ico'} alt={spot.name} />
        </div>
        <div className="secondary-images">
          {spot.SpotImages.slice(1, 5).map((image, index) => (
            <div key={image.id} className="secondary-image">
              <img src={image.url} alt={`${spot.name} ${index + 2}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="spot-info-container">
        <div className="spot-info">
          <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p className="description">{spot.description}</p>
        </div>

        <div className="spot-booking">
          <div className="booking-header">
            <div className="price">
              <span className="amount">${spot.price}</span> night
            </div>
            <div className="rating-reviews">
              <span>★ {spot.avgStarRating?.toFixed(1) || 'New'}</span>
              {spot.numReviews > 0 && (
                <span> · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</span>
              )}
            </div>
          </div>
          <button className="reserve-button">Reserve</button>
        </div>
      </div>

      <div className="reviews-section">
        <h2>
          ★ {spot.avgStarRating?.toFixed(1) || 'New'} 
          {spot.numReviews > 0 && (
            <span> · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</span>
          )}
        </h2>
        
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <h3>{review.User.firstName}</h3>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <p className="review-text">{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          sessionUser && sessionUser.id !== spot.Owner.id && (
            <p className="no-reviews">Be the first to post a review!</p>
          )
        )}
      </div>
    </div>
  );
}

export default SpotDetails;
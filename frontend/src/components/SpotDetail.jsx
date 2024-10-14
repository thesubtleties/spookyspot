import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch spot details');
        }
        const data = await response.json();
        setSpot(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotDetails();
  }, [id]);

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="images">
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          <>
            <img src={spot.SpotImages[0].url} alt={spot.name} className="large-image" />
            <div className="small-images">
              {spot.SpotImages.slice(1, 5).map((image, index) => (
                <img key={index} src={image.url} alt={`${spot.name} ${index + 1}`} className="small-image" />
              ))}
            </div>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>
      <p>Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}</p>
      <p>{spot.description}</p>
      <div className="callout-box">
        <p>${spot.price} <span>night</span></p>
        <p>{spot.numReviews} reviews</p>
        <p>Average Rating: {spot.avgStarRating || 'New'}</p>
        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
      </div>
    </div>
  );
}

export default SpotDetail;

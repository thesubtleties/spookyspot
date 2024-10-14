import React, { useState, useEffect } from 'react';

function SpotList() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots');
        const data = await response.json();
        setSpots(data.Spots);
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div className="spot-list">
      {spots.map((spot) => (
        <div key={spot.id} className="spot-tile">
          <img src={spot.previewImage} alt={spot.name} />
          <h2>{spot.name}</h2>
          <p>{spot.city}, {spot.state}</p>
          <p>${spot.price} per night</p>
        </div>
      ))}
    </div>
  );
}

export default SpotList;

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllSpotsThunk,
  createSpotThunk,
  updateSpotThunk,
  deleteSpotThunk,
  selectAllSpots,
} from '../../store/spots'; // adjust the import path as needed

function SpotsLayout() {
  const dispatch = useDispatch();
  const spots = useSelector(selectAllSpots);

  useEffect(() => {
    dispatch(fetchAllSpotsThunk());
  }, [dispatch]);

  const handleAddSpot = () => {
    const newSpot = {
      name: 'New Test Spot',
      description: 'This is a test spot',
      // add other required fields
    };
    dispatch(createSpotThunk(newSpot));
  };

  const handleUpdateSpot = (spotId) => {
    const updatedSpot = {
      id: spotId,
      name: 'Updated Spot Name',
      // add other fields you want to update
    };
    dispatch(updateSpotThunk(updatedSpot));
  };

  const handleDeleteSpot = (spotId) => {
    dispatch(deleteSpotThunk(spotId));
  };

  return (
    <div>
      <h1>Spots Layout Test Page</h1>
      <button onClick={handleAddSpot}>Add Test Spot</button>
      {spots && spots.length > 0 ? (
        spots.map((spot) => (
          <div key={spot.id}>
            <h2>{spot.name}</h2>
            <p>{spot.description}</p>
            <p>Price: ${spot.price}/night</p>
            <p>
              Location: {spot.city}, {spot.state}
            </p>
            {spot.avgRating && <p>Average Rating: {spot.avgRating}</p>}
            <button onClick={() => handleUpdateSpot(spot.id)}>Update</button>
            <button onClick={() => handleDeleteSpot(spot.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No spots available</p>
      )}
    </div>
  );
}

export default SpotsLayout;

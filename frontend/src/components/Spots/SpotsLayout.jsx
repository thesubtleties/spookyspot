import React, { useEffect, useCallback } from 'react';
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

  const generateRandomAddress = () => {
    const streets = ['Oak', 'Maple', 'Pine', 'Cedar', 'Elm', 'Birch', 'Willow'];
    const streetTypes = ['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr', 'Way'];
    const cities = [
      'Springville',
      'Autumnton',
      'Winterburg',
      'Summerset',
      'Fallsville',
    ];
    const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

    const streetNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const street = streets[Math.floor(Math.random() * streets.length)];
    const streetType =
      streetTypes[Math.floor(Math.random() * streetTypes.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zip = Math.floor(Math.random() * 90000) + 10000; // 10000-99999

    return {
      address: `${streetNumber} ${street} ${streetType}`,
      city,
      state,
      zip,
    };
  };

  const handleAddSpot = () => {
    const randomAddress = generateRandomAddress();
    const newSpot = {
      address: randomAddress.address,
      city: randomAddress.city,
      state: randomAddress.state,
      country: 'United States',
      lat: (Math.random() * (49 - 25) + 25).toFixed(7), // Random latitude between 25 and 49
      lng: (Math.random() * (-67 - -125) + -125).toFixed(7), // Random longitude between -125 and -67
      name: `Test Spot in ${randomAddress.city}`,
      description: `This is a randomly generated test spot in ${randomAddress.city}, ${randomAddress.state}. It's located at ${randomAddress.address} and offers a unique experience for visitors.`,
      price: Math.floor(Math.random() * 300) + 50, // Random price between 50 and 349
    };

    // Assuming you have image URLs to add
    const images = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];

    dispatch(createSpotThunk(newSpot, images));
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
      <button onClick={handleAddSpot}>Add Random Test Spot</button>
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

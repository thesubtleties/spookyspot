import { csrfFetch } from './csrf';

// Constants
const GET_ALL_SPOTS = 'spots/getAllSpots';
const ADD_SPOT = 'spots/addSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';
const SET_CURRENT_SPOT = 'spots/setSpot';
const GET_USER_SPOTS = 'spots/getUserSpots';
const ADD_SPOT_IMAGE = 'spots/addSpotImage';
const DELETE_SPOT_IMAGE = 'spots/deleteSpotImage';

// Actions
export const getAllSpots = (spotsData) => ({
  type: GET_ALL_SPOTS,
  payload: spotsData,
});

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
});

export const setCurrentSpot = (spot) => ({
  type: SET_CURRENT_SPOT,
  payload: spot,
});

export const getUserSpots = (spots) => ({
  type: GET_USER_SPOTS,
  payload: spots,
});

export const addSpotImage = (spotId, imageUrl) => ({
  type: ADD_SPOT_IMAGE,
  payload: { spotId, imageUrl },
});

export const deleteSpotImage = (imageId) => ({
  type: DELETE_SPOT_IMAGE,
  payload: imageId,
});

// Thunks
export const fetchAllSpotsThunk = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/spots');
    if (!response.ok) throw new Error('Failed to fetch spots');
    const data = await response.json();
    dispatch(getAllSpots(data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchSpotDetailsThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/spots/${spotId}`);
    const spot = await response.json();
    dispatch(setCurrentSpot(spot));
  } catch (error) {
    console.log('error in thunk', error);
  }
};

export const createSpotThunk = (spotData, images) => async (dispatch) => {
  try {
    const response = await csrfFetch('/spots', 'POST', spotData);
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        if (imageUrl) {
          await dispatch(addSpotImageThunk(newSpot.id, imageUrl, i === 0));
        }
      }
    }
    dispatch(fetchSpotDetailsThunk(newSpot.id));
    return newSpot;
  } catch (error) {
    console.log(error);
  }
};

export const updateSpotThunk = (spotData) => async (dispatch) => {
  try {
    console.log('updateSpotThunk called with data:', spotData);
    console.log('Spot data before sending:', spotData);
    console.log('lat type:', typeof spotData.lat);
    console.log('lng type:', typeof spotData.lng);
    const response = await csrfFetch(`/spots/${spotData.id}`, 'PUT', spotData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update failed. Server response:', errorData);
      throw new Error(errorData.message || 'Failed to update spot');
    }

    const updatedSpot = await response.json();
    console.log('Spot updated successfully:', updatedSpot);
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  } catch (error) {
    console.error('Error in updateSpotThunk:', error);
    throw error;
  }
};
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  try {
    await csrfFetch(`/spots/${spotId}`, 'DELETE');
    dispatch(deleteSpot(spotId));
  } catch (error) {
    console.log(error);
  }
};

export const getUserSpotsThunk = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/spots/current');
    if (!response.ok) {
      throw new Error('Failed to fetch user spots');
    }
    const userSpots = await response.json();
    console.log('Fetched user spots:', userSpots);
    dispatch(getUserSpots(userSpots));
  } catch (error) {
    console.error('Error in getUserSpotsThunk:', error);
    throw error;
  }
};

export const addSpotImageThunk =
  (spotId, imageUrl, preview = false) =>
  async (dispatch) => {
    try {
      const response = await csrfFetch(`/spots/${spotId}/images`, 'POST', {
        url: imageUrl,
        preview,
      });

      if (response.ok) {
        const newImage = await response.json();
        dispatch(addSpotImage(spotId, newImage));
        return newImage;
      } else {
        throw new Error('Failed to add image');
      }
    } catch (error) {
      console.error('Error adding spot image:', error);
      throw error;
    }
  };

export const deleteSpotImageThunk =
  (imageId, deletedImageIds) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/spot-images/${imageId}`, 'DELETE', {
        deletedImageIds,
      });

      if (response.ok) {
        dispatch(deleteSpotImage(imageId));
      }
    } catch (error) {
      console.error('Error deleting spot image:', error);
      throw error;
    }
  };
// Initial State
const initialState = {
  allSpots: [],
  userSpots: [],
  currentSpot: null,
};

// Reducer
function spotReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return {
        ...state,
        allSpots: action.payload.Spots || [],
      };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: [...state.allSpots, action.payload],
      };
    case UPDATE_SPOT:
      return {
        ...state,
        allSpots: state.allSpots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        ),
      };
    case DELETE_SPOT:
      return {
        ...state,
        allSpots: state.allSpots.filter((spot) => spot.id !== action.payload),
        userSpots: state.userSpots.filter((spot) => spot.id !== action.payload),
        currentSpot:
          state.currentSpot && state.currentSpot.id === action.payload
            ? null
            : state.currentSpot,
      };
    case SET_CURRENT_SPOT:
      return {
        ...state,
        currentSpot: action.payload,
      };
    case GET_USER_SPOTS:
      return {
        ...state,
        userSpots: action.payload.Spots,
      };
    case ADD_SPOT_IMAGE:
      return {
        ...state,
        currentSpot:
          state.currentSpot && state.currentSpot.id === action.payload.spotId
            ? {
                ...state.currentSpot,
                SpotImages: [
                  ...(state.currentSpot.SpotImages || []),
                  //! updated to have all image data in here
                  {
                    id: action.payload.id,
                    url: action.payload.url,
                    preview: action.payload.preview,
                  },
                ],
              }
            : state.currentSpot,
      };
    case DELETE_SPOT_IMAGE:
      return {
        ...state,
        currentSpot: state.currentSpot
          ? {
              ...state.currentSpot,
              SpotImages: state.currentSpot?.SpotImages.filter(
                (image) => image.id !== action.payload.imageId
              ),
            }
          : { ...state.currentSpot },
      };
    default:
      return state;
  }
}
// Selectors
export const selectAllSpots = (state) => state.spots?.allSpots || [];
export const selectCurrentSpot = (state) => state.spots.currentSpot;
export const selectIsCurrentUserOwner = (state, spotId) => {
  const currentUserId = state.session.user?.id;
  const spot = state.spots.allSpots[spotId];
  return spot?.ownerId === currentUserId;
};

export default spotReducer;

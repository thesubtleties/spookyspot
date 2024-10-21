import { csrfFetch } from './csrf';

// Constants
const GET_ALL_SPOTS = 'spots/getAllSpots';
const ADD_SPOT = 'spots/addSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';
const SET_CURRENT_SPOT = 'spots/setSpot';
const GET_USER_SPOTS = 'spots/getUserSpots';
const ADD_SPOT_IMAGE = 'spots/addSpotImage';

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

export const setSpot = (spot) => ({
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
    dispatch(setSpot(spot));
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

export const updateSpotThunk = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/spots/${spotData.id}`, 'PUT', spotData);
    const newSpot = await response.json();
    dispatch(updateSpot(newSpot));
  } catch (error) {
    console.log(error);
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
    const userSpots = await response.json();
    dispatch(getUserSpots(userSpots));
  } catch (error) {
    console.log(error);
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
      const newImage = await response.json();
      dispatch(addSpotImage(spotId, newImage));
    } catch (error) {
      console.log(error);
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
        userSpots: action.payload,
      };
    case ADD_SPOT_IMAGE:
      return {
        ...state,
        allSpots: state.allSpots.map((spot) =>
          spot.id === action.payload.spotId
            ? {
                ...spot,
                images: [...(spot.images || []), action.payload.imageUrl],
              }
            : spot
        ),
        currentSpot:
          state.currentSpot && state.currentSpot.id === action.payload.spotId
            ? {
                ...state.currentSpot,
                images: [
                  ...(state.currentSpot.images || []),
                  action.payload.imageUrl,
                ],
              }
            : state.currentSpot,
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

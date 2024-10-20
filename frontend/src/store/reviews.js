import { csrfFetch } from './csrf';

// Constants
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';

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

export const createSpotThunk = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch('/spots', 'POST', spotData);
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
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

// Initial State
const initialState = {
  allSpots: [],
  currentSpot: null,
};

// Reducer
function spotReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return {
        ...state,
        ...action.payload,
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
      };
    case SET_CURRENT_SPOT:
      return {
        ...state,
        currentSpot: action.payload,
      };
    default:
      return state;
  }
}
// Selectors
export const selectAllSpots = (state) => state.spots?.Spots || [];
export const selectCurrentSpot = (state) => state.spots.currentSpot;

export default spotReducer;

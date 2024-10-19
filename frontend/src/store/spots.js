import { TbAirConditioning } from 'react-icons/tb';
import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/getAllSpots';
const ADD_SPOT = 'spots/addSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';

export const getAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  payload: spots,
});

export const fetchAllSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/spots');
    if (!response.ok) throw new Error('Failed to fetch spots');
    const spots = await response.json();
    dispatch(getAllSpots(spots));
  } catch (error) {}
};
const initialState = {
  allSpots: [],
  currentSpot: null,
};

function spotReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ALL_SPOTS':
      return {
        ...state,
        allSpots: action.payload,
      };
    case 'ADD_SPOT':
      return {
        ...state,
        allSpots: [...state.allSpots, action.payload],
      };
    case 'UPDATE_SPOT':
      return {
        ...state,
        allSpots: state.allSpots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        ),
      };
  }
}

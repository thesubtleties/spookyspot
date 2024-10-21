import { csrfFetch } from './csrf';

// Constants
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const GET_REVIEWS_BY_SPOT = 'reviews/getReviewsBySpot';

// Actions
export const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

export const getReviewsBySpot = (spotReviews) => ({
  type: GET_REVIEWS_BY_SPOT,
  payload: spotReviews,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

// Thunks
export const addReviewThunk = (review) => async (dispatch) => {
  try {
    const response = await csrfFetch('/reviews', 'POST', review);
    const newReview = await response.json();
    dispatch(addReview(newReview));
  } catch (error) {
    console.log(error);
  }
};

export const getReviewsBySpotThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/spots/${spotId}/reviews`);
    const spotReviews = await response.json();
    dispatch(getReviewsBySpot(spotReviews));
  } catch (error) {
    console.log(error);
  }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/reviews/${reviewId}`, 'DELETE');
    dispatch(deleteReview(reviewId));
  } catch (error) {
    console.log(error);
  }
};
// Initial State
const initialState = {
  reviews: [],
};

// Reducer
function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_REVIEW:
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };
    case GET_REVIEWS_BY_SPOT:
      return {
        ...state,
        reviews: [...action.payload],
      };
    case DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.payload),
      };
    default:
      return state;
  }
}
// Selectors
export const selectReviewsBySpotId = (state, spotId) => {
  return state.reviews.reviews.filter((review) => review.spotId === spotId);
};
export const averageRatingBySpotId = (state, spotId) => {
  const spotReviews = selectReviewsBySpotId(state, spotId);
  if (spotReviews.length === 0) return 0;

  const sum = spotReviews.reduce((total, review) => total + review.stars, 0);
  return Number((sum / spotReviews.length).toFixed(2));
};

export default reviewReducer;
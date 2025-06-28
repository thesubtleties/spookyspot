import { csrfFetch } from './csrf';

// Constants
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const SET_REVIEWS_FOR_SPOT = 'reviews/setReviewsForSpot';

// Actions
export const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

export const setReviewsForSpot = (reviews) => ({
  type: SET_REVIEWS_FOR_SPOT,
  payload: reviews,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

// Thunks
export const addReviewThunk = (review) => async (dispatch, getState) => {
  try {
    const response = await csrfFetch(
      `/spots/${review.spotId}/reviews`,
      'POST',
      review
    );

    if (!response.ok) {
      throw new Error('Failed to add review');
    }

    const newReview = await response.json();
    const user = getState().session.user;

    const normalizedReview = {
      ...newReview,
      spotId: Number(newReview.spotId),
      User: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ReviewImages: [],
    };

    console.log('Normalized Review:', normalizedReview); // Debug log
    dispatch(addReview(normalizedReview));
    return normalizedReview;
  } catch (error) {
    console.error('Failed to add review:', error);
    throw error;
  }
};

export const getReviewsBySpotThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(setReviewsForSpot(data.Reviews));
  } catch (error) {
    console.log(error);
  }
};
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    await csrfFetch(`/reviews/${reviewId}`, 'DELETE');
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
    case SET_REVIEWS_FOR_SPOT:
      return {
        ...state,
        reviews: action.payload,
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

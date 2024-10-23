import { getReviewsBySpotThunk } from '../../store/reviews';
import { fetchSpotDetailsThunk } from '../../store/spots';

export const fetchSpotData = async (dispatch, spotId, fetchFns) => {
  await Promise.all([
    dispatch(
      fetchSpotDetailsThunk(spotId),
      dispatch(getReviewsBySpotThunk(spotId))
    ),
  ]);
};

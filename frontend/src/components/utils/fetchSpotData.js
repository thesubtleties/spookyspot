export const fetchSpotData = async (dispatch, spotId, thunkCreators) => {
  const dispatchPromises = thunkCreators.map((fn) => dispatch(fn(spotId)));
  await Promise.all(dispatchPromises);
};

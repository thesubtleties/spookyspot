export const calculateRating = (spot, formatRating) => {
  return spot.avgStarRating ? formatRating(spot.avgStarRating) : 'New';
};

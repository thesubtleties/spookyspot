export function formatRating(rating) {
  return rating != null ? Number(rating).toFixed(2) : 'New';
}

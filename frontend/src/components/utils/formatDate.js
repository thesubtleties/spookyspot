export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long' };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  const [month, year] = formattedDate.split(' ');

  return `${month}, ${year}`;
}

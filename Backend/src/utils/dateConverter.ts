export default function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear(); // Get the full year

  return `${day}-${month}-${year}`; // Return formatted date
}

// Example usage
// const today = new Date();
// const formattedDate = formatDate(today);
// console.log(formattedDate); // Output: dd-mm-yyyy

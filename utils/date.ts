export const customFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero
  const day = date.getDate().toString().padStart(2, "0"); // Adding leading zero
  return `${year}-${month}-${day}`;
};
//Ex

export function formatDateToTimestamp(dateString: string) {
  // Check if the dateString is a number (Unix timestamp) or a string
  let date;

  // Check if the input is a number (Unix timestamp)
  if (typeof dateString === "number") {
    // If it's already a Unix timestamp, directly create a Date object
    date = new Date(dateString);
  } else if (typeof dateString === "string" && !isNaN(Number(dateString))) {
    // If the input is a string that represents a number (Unix timestamp as string)
    date = new Date(Number(dateString));
  } else {
    // Otherwise, treat it as a standard date string
    date = new Date(dateString);
  }

  // If the date is invalid, return an error
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return null; // or throw an error
  }

  // Get the year, month (1-indexed), and day
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 1-indexed month
  const day = date.getDate().toString().padStart(2, "0");

  // Format the date as "YYYY-MM-DD"
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

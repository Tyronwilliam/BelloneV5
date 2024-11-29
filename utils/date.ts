export const customFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero
  const day = date.getDate().toString().padStart(2, "0"); // Adding leading zero
  return `${year}-${month}-${day}`;
};
//Ex
//const formattedDate = formatDate(new Date()); // "2024-01-16"

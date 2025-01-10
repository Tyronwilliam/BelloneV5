export const customFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const day = date.getDate().toString().padStart(2, "0"); 
  return `${year}-${month}-${day}`;
};

export function formatDateToTimestamp(dateString: string) {
  let date;

  if (typeof dateString === "number") {
    date = new Date(dateString);
  } else if (typeof dateString === "string" && !isNaN(Number(dateString))) {
    date = new Date(Number(dateString));
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return null; 
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const day = date.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

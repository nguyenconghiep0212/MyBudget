const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function GetToday(): Date {
  return new Date();
}
function formatCurrency(input: Number): string {
  const result = input.toLocaleString('en-US');
  return result;
}
function getWeekOfYear(date: Date): number {
  // Copy the date to avoid modifying the original
  const currentDate: any = new Date(date.getTime());

  // Set the first day of the year
  const startOfYear: any = new Date(currentDate.getFullYear(), 0, 1);

  // Calculate the difference in milliseconds between the current date and the start of the year
  const diffInMilliseconds = currentDate - startOfYear;

  // Calculate the day of the year (1-based)
  const dayOfYear = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

  // Get the day of the week for the start of the year (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = startOfYear.getDay();

  // Adjust the day of the year based on the ISO week starting on Monday
  const adjustedDayOfYear = dayOfYear + (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1);

  // Calculate the week number
  const weekNumber = Math.ceil(adjustedDayOfYear / 7);

  return weekNumber;
}

export { days, months, formatCurrency, getWeekOfYear, GetToday };

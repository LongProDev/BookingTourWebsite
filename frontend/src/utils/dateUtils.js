export const isScheduleExpired = (departureDate, departureTime) => {
  const now = new Date();
  const scheduleDatetime = new Date(`${departureDate}T${departureTime}`);
  return scheduleDatetime < now;
};

export const isFutureDateTime = (date, time) => {
  const now = new Date();
  const dateTime = new Date(`${date}T${time}`);
  return dateTime > now;
};

export const hasAvailableSeats = (schedules) => {
  if (!schedules || schedules.length === 0) return false;
  return schedules.some(schedule => schedule.availableSeats > 0);
}; 
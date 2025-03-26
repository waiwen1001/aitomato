import { addSeconds } from "date-fns";

export const addSecondsToDate = (date: Date, seconds: number) => {
  return addSeconds(date, seconds);
};

export const notFoundImage = () => {
  return "/uploads/assets/not-found.jpg";
};

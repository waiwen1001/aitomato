import { addSeconds } from "date-fns";

export const addSecondsToDate = (date: Date, seconds: number) => {
  return addSeconds(date, seconds);
};

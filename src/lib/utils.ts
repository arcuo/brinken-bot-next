import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortBirthdays(a: Date, b: Date) {
  const aBirthday = DateTime.fromJSDate(a).toFormat("MM-dd");
  const bBirthday = DateTime.fromJSDate(b).toFormat("MM-dd");
  return aBirthday.localeCompare(bBirthday);
}
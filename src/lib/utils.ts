import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSecondsToMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesPart = minutes > 0 ? `${minutes} min` : "";
  const secondsPart = remainingSeconds > 0 ? `${remainingSeconds} sec` : "";

  return [minutesPart, secondsPart].filter(Boolean).join(" ");
}

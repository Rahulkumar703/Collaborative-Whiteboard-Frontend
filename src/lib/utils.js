import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  { bg: "#000", text: "#fff" },
  { bg: "#f0f0f0", text: "#000000" },
  { bg: "#bfdbfe", text: "#1d4ed8" },
  { bg: "#fee2e2", text: "#f43f5e" },
  { bg: "#fef08a", text: "#ca8a04" },
  { bg: "#76f18c", text: "#1daa28" },
];

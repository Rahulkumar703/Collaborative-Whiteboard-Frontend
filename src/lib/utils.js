import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isValidRoomId = (id) => /^[A-Z0-9]{6}$/.test(id);

export const generateRoomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    // 6 characters
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

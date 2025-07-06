import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isValidRoomId = (id) => /^[a-zA-Z0-9]{6}$/.test(id);

export const generateRoomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const cursorColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#33FFF3",
  "#FF3333",
  "#33FF33",
  "#3333FF",
  "#FF33FF",
];

export const brushColors = [
  "#000000",
  "#FF4500",
  "#1E90FF",
  "#32CD32",
  "#FFD700",
  "#8A2BE2",
  "#FF69B4",
  "#4682B4",
  "#D2691E",
];

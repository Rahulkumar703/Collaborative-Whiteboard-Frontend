// src/context/useWhiteboard.js
import { WhiteboardContext } from "../context/whiteboardContext";
import { useContext } from "react";

export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error("useWhiteboard must be used within a WhiteboardProvider");
  }
  return context;
};

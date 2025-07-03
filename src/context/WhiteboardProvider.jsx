// src/context/WhiteboardContext.jsx
import { useRef, useState } from "react";
import { colors } from "../lib/utils";
import { WhiteboardContext } from "./whiteboardContext";

export const WhiteboardProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState(colors);
  const [lineWidth, setLineWidth] = useState(2);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <WhiteboardContext.Provider
      value={{
        canvasRef,
        color,
        setColor,
        lineWidth,
        setLineWidth,
        clearCanvas,
      }}
    >
      {children}
    </WhiteboardContext.Provider>
  );
};

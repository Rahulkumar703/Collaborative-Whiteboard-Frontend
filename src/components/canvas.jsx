"use client";
import { useEffect, useRef, useState } from "react";

// Drawing helpers moved from Whiteboard.jsx
export function drawStroke(ctx, path, color, width) {
  if (path.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
}

export function drawStrokeSegment(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function redrawCanvasFromHistory(canvasRef, drawingHistory, drawStroke) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory.current.forEach((command) => {
    if (command.type === "stroke") {
      const { path, color, width } = command.data;
      drawStroke(ctx, path, color, width);
    } else if (command.type === "clear") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
}

export function redrawCanvasWithCurrentStroke(
  canvasRef,
  drawingHistory,
  currentDrawingStroke,
  strokeColor,
  strokeWidth,
  drawStroke
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory.current.forEach((command) => {
    if (command.type === "stroke") {
      const { path, color, width } = command.data;
      drawStroke(ctx, path, color, width);
    } else if (command.type === "clear") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
  if (currentDrawingStroke.current.length > 1) {
    drawStroke(ctx, currentDrawingStroke.current, strokeColor, strokeWidth);
  }
}

function Canvas({
  canvasRef,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
  strokeColor,
  strokeWidth,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const prevPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.7;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e) => {
      const pos = getPos(e);
      prevPos.current = pos;
      setIsDrawing(true);
      onDrawStart({ ...pos, color: strokeColor, width: strokeWidth });
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      onDrawMove({ ...pos, color: strokeColor, width: strokeWidth });
      prevPos.current = pos;
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      onDrawEnd();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    // Touch support (optional)
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseDown(touch);
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseMove(touch);
    };
    const handleTouchEnd = () => handleMouseUp();

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDrawing, strokeColor, strokeWidth, onDrawStart, onDrawMove, onDrawEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      style={{
        border: "1px solid black",
        background: "white",
        cursor: "crosshair",
      }}
    >
      Your browser does not support the HTML5 canvas tag.
    </canvas>
  );
}

export default Canvas;

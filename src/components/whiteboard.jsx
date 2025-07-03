import { useEffect, useRef, useState } from "react";
import { useWhiteboard } from "../hooks/useWhiteboard";

const Whiteboard = () => {
  const { canvasRef, color, lineWidth } = useWhiteboard();
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const frameRef = useRef(null);
  const drawQueue = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 80) * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight - 80}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // Ensure crisp drawing
    ctx.lineCap = "round";
    ctx.strokeStyle = color.bg;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color.bg;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setLastPoint({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !lastPoint) return;
    const { offsetX, offsetY } = e.nativeEvent;
    drawQueue.current.push({ x: offsetX, y: offsetY });
    if (!frameRef.current) frameRef.current = requestAnimationFrame(flushDraw);
  };

  const flushDraw = () => {
    const ctx = ctxRef.current;
    const points = drawQueue.current;
    if (points.length === 0) return;

    for (let i = 0; i < points.length; i++) {
      const curr = points[i];
      const midX = (lastPoint.x + curr.x) / 2;
      const midY = (lastPoint.y + curr.y) / 2;
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
      ctx.stroke();
      setLastPoint({ x: curr.x, y: curr.y });
    }

    drawQueue.current = [];
    frameRef.current = null;
  };

  const stopDrawing = () => {
    flushDraw(); // flush remaining
    ctxRef.current.closePath();
    setIsDrawing(false);
    setLastPoint(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-white"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

export default Whiteboard;

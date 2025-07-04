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
    canvas.height = (window.innerHeight - 113) * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight - 113}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
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
  const getCanvasCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const { x, y } = getCanvasCoordinates(e, canvas);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setLastPoint({ x, y });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const { x, y } = getCanvasCoordinates(e, canvas);
    drawQueue.current.push({ x, y });
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

  const stopDrawing = (e) => {
    e?.preventDefault?.();
    flushDraw();
    ctxRef.current.closePath();
    setIsDrawing(false);
    setLastPoint(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="bg-white flex-1 border touch-none"
      onMouseDown={startDrawing}
      onTouchStart={startDrawing}
      onMouseMove={draw}
      onTouchMove={draw}
      onMouseUp={stopDrawing}
      onTouchEnd={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchCancel={stopDrawing}
    />
  );
};

export default Whiteboard;

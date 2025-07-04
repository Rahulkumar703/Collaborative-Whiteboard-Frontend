import React, { useRef, useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import { throttle } from "lodash";
import Toolbar from "./Toolbar";
import UserCursors from "./UserCursors";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [userCount, setUserCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState({});
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const drawingHistory = useRef([]);
  const currentPath = useRef([]);
  const isDrawing = useRef(false);
  const lastRemoteStroke = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 140; // Approximate height for toolbar/header
      redrawCanvas(ctx);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socketRef.current = socket;

    socket.emit("join-room", { roomId });

    socket.on("user-count", setUserCount);
    socket.on("active-users", setActiveUsers);

    socket.on("user-joined", ({ socketId, name }) => {
      setActiveUsers((prev) => ({
        ...prev,
        [socketId]: { x: 0, y: 0, name },
      }));
    });

    socket.on("user-left", (socketId) => {
      setActiveUsers((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    socket.on("cursor-update", ({ socketId, x, y, name }) => {
      setActiveUsers((prev) => ({
        ...prev,
        [socketId]: {
          ...(prev[socketId] || {}),
          x,
          y,
          name,
        },
      }));
    });

    socket.on("load-drawing", (history) => {
      drawingHistory.current = history;
      redrawCanvas(ctx);
    });

    socket.on("draw-start", (pt) => {
      lastRemoteStroke.current = [pt];
    });

    socket.on("draw-move", (pt) => {
      const lastPt = lastRemoteStroke.current.slice(-1)[0];
      drawSegment(ctx, lastPt, pt, pt.color, pt.width);
      lastRemoteStroke.current.push(pt);
    });

    socket.on("draw-end", (data) => {
      drawStroke(ctx, data.path, data.color, data.width);
    });

    socket.on("clear-canvas", () => {
      drawingHistory.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      socket.emit("leave-room", { roomId });
      socket.disconnect();
    };
  }, [roomId]);

  const drawSegment = (ctx, p1, p2, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  const drawStroke = (ctx, path, color, width) => {
    if (path.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  };

  const redrawCanvas = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawingHistory.current.forEach((cmd) => {
      if (cmd.type === "stroke") {
        drawStroke(ctx, cmd.data.path, cmd.data.color, cmd.data.width);
      }
    });
  };

  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e) => {
    const pos = getCanvasPos(e);
    isDrawing.current = true;
    currentPath.current = [pos];
    socketRef.current.emit("draw-start", {
      ...pos,
      color: strokeColor,
      width: strokeWidth,
    });
  };

  const handleMouseMove = (e) => {
    const pos = getCanvasPos(e);
    if (isDrawing.current) {
      const last = currentPath.current[currentPath.current.length - 1];
      drawSegment(
        canvasRef.current.getContext("2d"),
        last,
        pos,
        strokeColor,
        strokeWidth
      );
      currentPath.current.push(pos);
      socketRef.current.emit("draw-move", {
        ...pos,
        color: strokeColor,
        width: strokeWidth,
      });
    }
    throttledCursorMove(pos);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    socketRef.current.emit("draw-end", {
      path: currentPath.current,
      color: strokeColor,
      width: strokeWidth,
    });
    currentPath.current = [];
  };

  const throttledCursorMove = useCallback(
    throttle((pos) => {
      socketRef.current.emit("cursor-move", pos);
    }, 100),
    []
  );

  const handleClearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawingHistory.current = [];
    socketRef.current.emit("clear-canvas");
  };

  return (
    <div
      className="whiteboard-container w-screen h-screen overflow-hidden flex flex-col"
      onMouseMove={handleMouseMove}
    >
      <div className="flex justify-between items-center bg-secondary shadow p-4 py-0 pt-4 sticky top-0 z-10">
        <h2 className="font-semibold text-lg">
          <span className="text-muted-foreground">Room Code: </span>
          {roomId}
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">👥 {userCount} Online</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Active Members</DialogTitle>
            </DialogHeader>
            <ul className="mt-4 space-y-2">
              {Object.values(activeUsers).map((user, idx) => (
                <li key={idx} className="text-sm">
                  {user.name || `User-${idx}`}
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>

      <Toolbar
        onColorChange={setStrokeColor}
        onWidthChange={setStrokeWidth}
        onClearCanvas={handleClearCanvas}
        currentColor={strokeColor}
        currentWidth={strokeWidth}
      />

      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full block bg-white cursor-crosshair"
        />
        <UserCursors
          activeUsers={activeUsers}
          currentSocketId={socketRef.current?.id}
        />
      </div>
    </div>
  );
}

export default Whiteboard;

"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { throttle } from "lodash";
import Toolbar from "./toolbar";
import UserCursors from "./users-cursor";
import { getSocket } from "@/socket";

// Define a FIXED internal resolution for the canvas.
const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 3000;

function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [userCount, setUserCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState({});
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const drawingHistory = useRef([]);
  const currentLocalPath = useRef([]);
  const isDrawing = useRef(false);
  const remoteDrawingStates = useRef({});
  const isPanning = useRef(false);

  const scrollContainerRef = useRef(null);

  const socket = getSocket();

  // New state for custom cursor
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);

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
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  };

  const redrawCanvas = useCallback((ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const socketId in remoteDrawingStates.current) {
      const remotePath = remoteDrawingStates.current[socketId];
      if (remotePath && remotePath.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(remotePath[0].x, remotePath[0].y);
        for (let i = 1; i < remotePath.length; i++) {
          ctx.lineTo(remotePath[i].x, remotePath[i].y);
        }
        ctx.strokeStyle = remotePath[0].color;
        ctx.lineWidth = remotePath[0].width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    }

    drawingHistory.current.forEach((cmd) => {
      if (cmd.type === "stroke") {
        drawStroke(ctx, cmd.data.path, cmd.data.color, cmd.data.width);
      }
    });
  }, []);

  // Use refs to keep track of the latest strokeColor and strokeWidth for native event handlers
  const latestStrokeColor = useRef(strokeColor);
  const latestStrokeWidth = useRef(strokeWidth);

  useEffect(() => {
    latestStrokeColor.current = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    latestStrokeWidth.current = strokeWidth;
  }, [strokeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    redrawCanvas(ctx);

    // --- Native event listeners for touch events ---
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        // Call handlePointerDown, passing the latest color and width
        handlePointerDown(
          e,
          latestStrokeColor.current,
          latestStrokeWidth.current
        );
        // Show custom cursor on touch start (single finger)
        const pos = getCanvasPos(e);
        setCursorPosition(pos);
        setIsCursorVisible(true);
      } else if (e.touches.length === 2) {
        isPanning.current = true;
        if (isDrawing.current) {
          handlePointerUp(e);
        }
        setIsCursorVisible(false); // Hide custom cursor when panning
      }
      if (e.touches && e.touches.length > 0) {
        throttledCursorMove(e);
      }
    };

    const handleTouchMove = (e) => {
      if (isDrawing.current && e.touches.length === 1) {
        e.preventDefault();
        // Call handlePointerMove, passing the latest color and width
        handlePointerMove(
          e,
          latestStrokeColor.current,
          latestStrokeWidth.current
        );
        const pos = getCanvasPos(e);
        setCursorPosition(pos);
      } else if (isPanning.current && e.touches.length === 2) {
        // Let browser handle scroll
        setIsCursorVisible(false); // Ensure cursor is hidden during pan
      } else {
        setIsCursorVisible(false); // If not drawing or panning, hide cursor
      }
      if (e.touches && e.touches.length > 0) {
        throttledCursorMove(e);
      }
    };

    const handleTouchEnd = (e) => {
      isPanning.current = false;
      handlePointerUp(e);
      setIsCursorVisible(false); // Hide custom cursor on touch end
    };

    // Attach native event listeners
    if (canvas) {
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchcancel", handleTouchEnd);
    }

    // --- End Native event listeners ---

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
        delete remoteDrawingStates.current[socketId];
        return updated;
      });
    });

    socket.on("cursor-update", ({ socketId, x, y, name }) => {
      setActiveUsers((prev) => ({
        ...prev,
        [socketId]: {
          ...(prev[socketId] || {}),
          x: x - (scrollContainerRef.current?.scrollLeft || 0),
          y: y - (scrollContainerRef.current?.scrollTop || 0),
          name,
        },
      }));
    });

    socket.on("load-drawing", (history) => {
      drawingHistory.current = history;
      redrawCanvas(ctx);
    });

    socket.on("draw-start", (pt) => {
      remoteDrawingStates.current[pt.socketId] = [
        { x: pt.x, y: pt.y, color: pt.color, width: pt.width },
      ];
      redrawCanvas(ctx);
    });

    socket.on("draw-move", (pt) => {
      const remotePath = remoteDrawingStates.current[pt.socketId];
      if (remotePath && remotePath.length > 0) {
        const lastPt = remotePath[remotePath.length - 1];
        drawSegment(ctx, lastPt, pt, pt.color, pt.width);
        remotePath.push(pt);
      }
    });

    socket.on("draw-end", (data) => {
      const { socketId, path, color, width } = data;
      drawingHistory.current.push({
        type: "stroke",
        data: { path, color, width },
      });
      redrawCanvas(ctx);
      delete remoteDrawingStates.current[socketId];
    });

    socket.on("clear-canvas", () => {
      drawingHistory.current = [];
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    });

    return () => {
      // Clean up native event listeners
      if (canvas) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchcancel", handleTouchEnd);
      }

      socket.emit("leave-room", { roomId });
      socket.disconnect();
    };
  }, [roomId, redrawCanvas]); // Added latestStrokeColor.current and latestStrokeWidth.current

  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return { x, y };
  };

  // Modify handlePointerDown to accept color and width as arguments
  const handlePointerDown = (e, colorOverride, widthOverride) => {
    const pos = getCanvasPos(e);
    isDrawing.current = true;
    currentLocalPath.current = [pos];
    socketRef.current.emit("draw-start", {
      ...pos,
      color: colorOverride || strokeColor, // Use override or current state
      width: widthOverride || strokeWidth, // Use override or current state
    });
    // Update custom cursor on mouse down too
    setCursorPosition(pos);
    setIsCursorVisible(true);
  };

  // Modify handlePointerMove to accept color and width as arguments
  const handlePointerMove = (e, colorOverride, widthOverride) => {
    const pos = getCanvasPos(e);
    if (isDrawing.current) {
      const ctx = canvasRef.current.getContext("2d");
      const last =
        currentLocalPath.current[currentLocalPath.current.length - 1];

      drawSegment(
        ctx,
        last,
        pos,
        colorOverride || strokeColor,
        widthOverride || strokeWidth
      );
      currentLocalPath.current.push(pos);

      throttledEmitDrawMove(
        pos,
        colorOverride || strokeColor,
        widthOverride || strokeWidth
      );
    }

    // Always update custom cursor position on move (if visible)
    if (!isPanning.current) {
      setCursorPosition(pos);
      if (!isDrawing.current && (!e.touches || e.touches.length === 1)) {
        setIsCursorVisible(true);
      }
    }

    // For desktop mouse move, we need to explicitly call cursor update here
    if (!e.touches || e.touches.length === 0) {
      throttledCursorMove(e);
    }
  };

  // Update throttledEmitDrawMove to accept color and width as arguments
  const throttledEmitDrawMove = useCallback(
    throttle((pos, color, width) => {
      // Accept color and width
      socketRef.current.emit("draw-move", {
        ...pos,
        color: color, // Use the passed color
        width: width, // Use the passed width
      });
    }, 20),
    [] // No dependencies here, as color and width are passed as arguments
  );

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const fullStrokeData = {
      path: currentLocalPath.current,
      color: latestStrokeColor.current, // Use latest value from ref for final stroke data
      width: latestStrokeWidth.current, // Use latest value from ref for final stroke data
    };

    drawingHistory.current.push({ type: "stroke", data: fullStrokeData });
    socketRef.current.emit("draw-end", fullStrokeData);
    currentLocalPath.current = [];

    redrawCanvas(canvasRef.current.getContext("2d"));
    // Hide custom cursor on pointer up
    setIsCursorVisible(false);
  };

  const handleMouseLeave = () => {
    if (!isDrawing.current) {
      setIsCursorVisible(false);
    }
    handlePointerUp();
  };

  const throttledCursorMove = useCallback(
    throttle((e) => {
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const pos_x_relative_to_canvas = clientX - rect.left;
      const pos_y_relative_to_canvas = clientY - rect.top;

      const currentScrollLeft = scrollContainerRef.current?.scrollLeft || 0;
      const currentScrollTop = scrollContainerRef.current?.scrollTop || 0;

      socketRef.current.emit("cursor-move", {
        x: pos_x_relative_to_canvas + currentScrollLeft,
        y: pos_y_relative_to_canvas + currentScrollTop,
      });
    }, 100),
    []
  );

  const handleClearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawingHistory.current = [];
    socketRef.current.emit("clear-canvas");
  };

  return (
    <div className="whiteboard-container w-screen h-screen overflow-hidden flex flex-col">
      <Toolbar
        userCount={userCount}
        roomId={roomId}
        activeUsers={activeUsers}
        onColorChange={setStrokeColor}
        onWidthChange={setStrokeWidth}
        onClearCanvas={handleClearCanvas}
        currentColor={strokeColor}
        currentWidth={strokeWidth}
      />

      {/* The scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex-grow relative overflow-auto bg-gray-100"
        onMouseUp={handlePointerUp}
        onMouseLeave={handleMouseLeave}
      >
        <canvas
          ref={canvasRef}
          // For desktop, handlePointerDown/Move are called directly,
          // and they will use the latest `strokeColor` and `strokeWidth` state.
          onMouseDown={(e) => handlePointerDown(e, strokeColor, strokeWidth)}
          onMouseMove={(e) => handlePointerMove(e, strokeColor, strokeWidth)}
          className="block bg-white cursor-none"
          style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
        />

        {/* Custom Cursor Element */}
        {isCursorVisible && (
          <div
            className="absolute rounded-full pointer-events-none transition-none duration-75 ease-linear"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              width: `${strokeWidth}px`, // Diameter of the circle
              height: `${strokeWidth}px`, // Diameter of the circle
              backgroundColor: strokeColor,
              // Center the cursor dot on the actual pointer position
              transform: `translate(-50%, -50%)`,
              zIndex: 100, // Ensure it's above everything else
              opacity: isDrawing.current ? 0.8 : 0.6, // Slightly transparent when not drawing
              border: `1px solid ${
                strokeColor === "#ffffff" ? "#cccccc" : "#000"
              }`, // Add a border for visibility on white
              boxShadow: `0 0 5px ${strokeColor}80`, // Subtle glow
            }}
          />
        )}

        <UserCursors
          pointerColor={strokeColor}
          activeUsers={activeUsers}
          currentSocketId={socketRef.current?.id}
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </div>
  );
}

export default Whiteboard;

import { useEffect, useState } from "react";
import Toolbar from "../components/toolbar";
import Whiteboard from "../components/Whiteboard";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Cursor from "../components/cursor";

export const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const roomIdFlat = roomId.replace("-", "");

  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (roomIdFlat.length !== 6) {
      toast.error("Invalid room ID. Please enter a valid 6-character room ID.");
      navigate("/");
    }
  }, [roomIdFlat, navigate]);

  useEffect(() => {
    let timeout;

    const updatePosition = (x, y) => {
      setPosition({ x, y });
      setShowCursor(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowCursor(false);
      }, 3000); // hide after 3s of inactivity
    };

    const onMouseMove = (e) => {
      updatePosition(e.offsetX, e.offsetY);
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        updatePosition(x, y);
      }
    };

    const board = document.getElementById("whiteboard-container");
    if (board) {
      board.addEventListener("mousemove", onMouseMove);
      board.addEventListener("touchmove", onTouchMove);
    }

    return () => {
      board?.removeEventListener("mousemove", onMouseMove);
      board?.removeEventListener("touchmove", onTouchMove);
      clearTimeout(timeout);
    };
  }, []);

  const collaboratorsCursors = [
    // {
    //   name: "Sonu",
    //   color: "#3b82f6",
    //   position: { x: 1000, y: 300 },
    // },
    // {
    //   name: "Rohit",
    //   color: "#f97316",
    //   position: { x: 200, y: 200 },
    // },
    // {
    //   name: "Sizuka",
    //   color: "#10b981",
    //   position: { x: 500, y: 500 },
    // },
  ];

  return (
    <div className="flex flex-col h-screen w-full">
      <Toolbar roomId={roomIdFlat} />
      <div
        id="whiteboard-container"
        className="relative flex-1 cursor-none w-full h-full overflow-clip touch-none"
      >
        {collaboratorsCursors.map((cursor) => (
          <Cursor key={cursor.name} {...cursor} />
        ))}
        {showCursor && <Cursor position={position} name="You" color="#000" />}
        <Whiteboard />
      </div>
    </div>
  );
};

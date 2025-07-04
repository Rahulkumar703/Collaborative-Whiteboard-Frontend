import { useEffect } from "react";

const cursorColors = [
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

const assignedColors = {};
let availableColors = [...cursorColors];

export default function UserCursors({ activeUsers, currentSocketId }) {
  useEffect(() => {
    const activeIds = Object.keys(activeUsers);

    for (const socketId in assignedColors) {
      if (!activeIds.includes(socketId)) {
        availableColors.push(assignedColors[socketId]);
        delete assignedColors[socketId];
      }
    }

    for (const socketId of activeIds) {
      if (!assignedColors[socketId]) {
        assignedColors[socketId] = availableColors.shift() || "#000000";
      }
    }
  }, [activeUsers]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      {Object.entries(activeUsers).map(([socketId, user]) => {
        if (socketId === currentSocketId) return null;

        const { x = 0, y = 0, name = "Anonymous" } = user;
        const color = assignedColors[socketId] || "#000000";

        return (
          <div
            key={socketId}
            className="absolute text-xs px-2 py-1 rounded shadow text-white transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: x,
              top: y,
              backgroundColor: color,
            }}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}

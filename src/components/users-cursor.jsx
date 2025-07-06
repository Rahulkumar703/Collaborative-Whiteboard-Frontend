"use client";
import { cursorColors } from "@/lib/utils";
import { useEffect, useRef } from "react";

const assignedColors = {};
let availableColors = [...cursorColors];

export default function UserCursors({ activeUsers, currentSocketId }) {
  const prevActiveUserKeys = useRef([]);

  useEffect(() => {
    const currentActiveIds = Object.keys(activeUsers);
    const prevIds = prevActiveUserKeys.current;

    for (const socketId of prevIds) {
      if (!currentActiveIds.includes(socketId) && assignedColors[socketId]) {
        availableColors.push(assignedColors[socketId]);
        delete assignedColors[socketId];
      }
    }

    for (const socketId of currentActiveIds) {
      if (!assignedColors[socketId]) {
        assignedColors[socketId] = availableColors.shift() || "#666666";
      }
    }

    prevActiveUserKeys.current = currentActiveIds;
  }, [activeUsers]);

  return (
    <div className="absolute top-0 left-0 pointer-events-none z-10">
      {Object.entries(activeUsers).map(([socketId, user]) => {
        if (socketId === currentSocketId) return null;

        const { x = 0, y = 0, name = "Anonymous" } = user;
        const color = assignedColors[socketId] || "#000000";

        return (
          <div
            key={socketId}
            className="absolute w-3 h-3 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-none duration-75 ease-linear"
            style={{
              left: x,
              top: y,
              backgroundColor: color,
              borderColor: color,
            }}
          >
            <span
              className="absolute whitespace-nowrap text-white px-2 py-1 rounded shadow-md text-xs bottom-[-20px] left-1/2 -translate-x-1/2 opacity-90 z-30"
              style={{
                backgroundColor: color,
              }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import { isValidRoomId } from "@/lib/utils";

const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const connectToRoom = async (roomId = "") => {
  let joiningRoomId = roomId.trim();
  try {
    if (!isValidRoomId(joiningRoomId)) {
      joiningRoomId = "";
    }
    const response = await fetch(`${url}/api/rooms/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId: joiningRoomId }),
    });
    const data = await response.json();
    const joinedRoomId = data.room.roomId;
    return joinedRoomId;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRoom = async (roomId) => {
  try {
    const response = await fetch(`${url}/api/rooms/${roomId}`);
    const data = await response.json();
    return data.room || null;
  } catch (error) {
    throw new Error(error.message);
  }
};

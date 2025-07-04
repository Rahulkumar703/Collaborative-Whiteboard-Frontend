import axios from "axios";
import { isValidRoomId } from "../lib/utils";

export const connectToRoom = async (roomId = "") => {
  let joiningRoomId = roomId.trim();
  try {
    if (!isValidRoomId(joiningRoomId)) {
      joiningRoomId = "";
    }
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/rooms/join`,
      {
        roomId: joiningRoomId,
      }
    );
    const joinedRoomId = response.data.room.roomId;
    return joinedRoomId;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRoom = async (roomId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomId}`
    );
    return response.data?.room || null;
  } catch (error) {
    throw new Error(error.message);
  }
};

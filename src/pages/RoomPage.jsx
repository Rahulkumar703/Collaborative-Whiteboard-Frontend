import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { connectToRoom } from "../data/api";
import { toast } from "sonner";
import Whiteboard from "../components/Whiteboard";

function RoomPage() {
  const { roomId } = useParams();
  const [joiningRoomId, setJoiningRoomId] = useState(roomId);

  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const handleJoinRoom = async () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      try {
        const joinedRoomId = await connectToRoom(roomId);
        if (roomId !== joinedRoomId) {
          setJoiningRoomId(joinedRoomId);
          window.location.replace(`/room/${joinedRoomId}`);
        } else {
          setJoiningRoomId(joinedRoomId);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    handleJoinRoom();
  }, [roomId]);

  return <Whiteboard roomId={joiningRoomId} />;
}

export default RoomPage;

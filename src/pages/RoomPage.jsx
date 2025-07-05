import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import Loader from "../components/Loader";

// Lazy-load the Whiteboard component
const Whiteboard = lazy(() => import("../components/Whiteboard"));

function RoomPage() {
  const { roomId } = useParams();
  const [joiningRoomId, setJoiningRoomId] = useState(roomId);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const handleJoinRoom = async () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      try {
        // Optionally dynamically import API too
        const { connectToRoom } = await import("../data/api");
        const joinedRoomId = await connectToRoom(roomId);
        if (roomId !== joinedRoomId) {
          setJoiningRoomId(joinedRoomId);
          window.location.replace(`/room/${joinedRoomId}`);
        } else {
          setJoiningRoomId(joinedRoomId);
        }
      } catch (error) {
        toast.error(error.message || "Failed to join room");
      }
    };

    handleJoinRoom();
  }, [roomId]);

  return (
    <Suspense fallback={<Loader />}>
      <Whiteboard roomId={joiningRoomId} />
    </Suspense>
  );
}

export default RoomPage;

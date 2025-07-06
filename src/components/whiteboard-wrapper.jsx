"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import Loader from "./loader";
import { useRouter } from "next/navigation";

const Whiteboard = lazy(() => import("./whiteboard"));

const WhiteboardWrapper = ({ roomId }) => {
  const [joiningRoomId, setJoiningRoomId] = useState(roomId);
  const hasJoinedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const handleJoinRoom = async () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      try {
        const { connectToRoom } = await import("@/actions/room");
        const joinedRoomId = await connectToRoom(roomId);

        if (roomId !== joinedRoomId) {
          setJoiningRoomId(joinedRoomId);
          router.replace(`/room/${joinedRoomId}`);
        } else {
          setJoiningRoomId(joinedRoomId);
        }
      } catch (error) {
        toast.error(error?.message || "Failed to join room");
      }
    };

    handleJoinRoom();
  }, [roomId]);

  return (
    <Suspense fallback={<Loader />}>
      <Whiteboard roomId={joiningRoomId} />
    </Suspense>
  );
};

export default WhiteboardWrapper;

import { useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { connectToRoom } from "../data/api";
import { toast } from "sonner";

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

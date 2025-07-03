import { useEffect } from "react";
import Toolbar from "../components/toolbar";
import Whiteboard from "../components/Whiteboard";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const roomIdFlat = roomId.replace("-", "");
  // If the roomId is invalid, redirect to home
  useEffect(() => {
    if (roomIdFlat.length !== 6) {
      toast.error("Invalid room ID. Please enter a valid 6-character room ID.");
      navigate("/");
    }
  }, [roomIdFlat, navigate]);

  return (
    <div className="flex flex-col h-screen w-full">
      <Toolbar roomId={roomIdFlat} />
      <Whiteboard />
    </div>
  );
};

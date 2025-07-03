import { LogIn, Plus } from "lucide-react";
import { Button } from "../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomId.length === 6) {
      navigate(`/room/${roomId.slice(0, 3)}-${roomId.slice(3)}`);
    } else {
      toast.error("Please enter a valid 6-character room ID.");
    }
  };

  const creatRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomId.slice(0, 3)}-${newRoomId.slice(3)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 p-4 text-center">
      <h1 className="font-bold sm:text-6xl text-5xl">
        Welcome to the Collaborative Paint App
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground">
        Create or join a room to start collaborating on your next masterpiece!
      </p>
      <img
        src="/logo.svg"
        alt="Collaborative Paint"
        className="w-52 h-52 mb-4"
      />
      <div className="flex gap-6 md:flex-row flex-col">
        <Button
          variant={"outline"}
          className={"flex items-center gap-2"}
          onClick={creatRoom}
        >
          <Plus className="w-4 h-4" />
          Create Room
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className={"flex items-center gap-2"}>
              <LogIn className="w-4 h-4" />
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join Room</DialogTitle>
              <DialogDescription>
                Enter the room ID to join an existing room. If you don't have a
                room ID, please ask the room owner to share it with you.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <InputOTP
                maxLength={6}
                value={roomId}
                onChange={(value) => setRoomId(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className={"uppercase"} />
                  <InputOTPSlot index={1} className={"uppercase"} />
                  <InputOTPSlot index={2} className={"uppercase"} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className={"uppercase"} />
                  <InputOTPSlot index={4} className={"uppercase"} />
                  <InputOTPSlot index={5} className={"uppercase"} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className={"flex items-center gap-2"} onClick={joinRoom}>
              Join Room
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;

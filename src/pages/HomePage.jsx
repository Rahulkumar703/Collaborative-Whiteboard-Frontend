import { LogIn, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { generateRoomCode } from "@/lib/utils";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = async () => {
    navigate(`/room/${roomId || generateRoomCode().toUpperCase()}`);
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
        {/* Create Room Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={joinRoom}
        >
          <Plus className="w-4 h-4" />
          Create Room
        </Button>

        {/* Join Room Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join Room</DialogTitle>
              <DialogDescription>
                Enter your name and the 6-character room ID to join.
              </DialogDescription>
            </DialogHeader>

            <form
              className="flex flex-col gap-4 items-start w-full"
              onSubmit={(e) => {
                e.preventDefault();
                joinRoom();
              }}
            >
              <Label htmlFor="room-id">Room ID</Label>
              <InputOTP
                id="room-id"
                maxLength={6}
                value={roomId}
                onChange={(val) => setRoomId(val.toUpperCase())}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="uppercase" />
                  <InputOTPSlot index={1} className="uppercase" />
                  <InputOTPSlot index={2} className="uppercase" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="uppercase" />
                  <InputOTPSlot index={4} className="uppercase" />
                  <InputOTPSlot index={5} className="uppercase" />
                </InputOTPGroup>
              </InputOTP>

              <Button type="submit" className="w-full flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Join Room
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;

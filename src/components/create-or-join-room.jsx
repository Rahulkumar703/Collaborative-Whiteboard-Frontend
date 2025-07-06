"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { generateRoomCode } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const CreateOrJoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    router.push(`/room/${roomId || generateRoomCode().toUpperCase()}`);
  };

  return (
    <div className="flex gap-6 md:flex-row flex-col">
      {/* Create Room */}
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={joinRoom}
      >
        <Plus className="w-4 h-4" />
        Create Room
      </Button>

      {/* Join Room */}
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
              type="text"
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              id="room-id"
              maxLength={6}
              value={roomId}
              onChange={(val) => setRoomId(val.toUpperCase())}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  inputMode="text"
                  className="uppercase"
                />
                <InputOTPSlot
                  index={1}
                  inputMode="text"
                  className="uppercase"
                />
                <InputOTPSlot
                  index={2}
                  inputMode="text"
                  className="uppercase"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  inputMode="text"
                  className="uppercase"
                />
                <InputOTPSlot
                  index={4}
                  inputMode="text"
                  className="uppercase"
                />
                <InputOTPSlot
                  index={5}
                  inputMode="text"
                  className="uppercase"
                />
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
  );
};

export default CreateOrJoinRoom;

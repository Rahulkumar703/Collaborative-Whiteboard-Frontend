import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Copy, LogOut, Share, UserPlus } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

const RoomInfo = ({ roomId }) => {
  const Collaborators = [
    { name: "You", initials: "Y" },
    // { name: "Sonu", initials: "S" },
    // { name: "Rohit", initials: "R" },
    // { name: "Sizuka", initials: "S" },
  ];
  const navigate = useNavigate();

  const leaveRoom = () => {
    navigate("/");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(`${frontendUrl}/room/${roomId}`).then(() => {
      toast.success("Room ID copied to clipboard");
    });
  };

  return (
    <div className="flex justify-between items-center flex-1">
      {/* Current Room ID */}
      <div className="flex flex-col gap-2 items-center">
        <InputOTP maxLength={6} value={roomId}>
          <InputOTPGroup className={""}>
            <InputOTPSlot index={0} className={"size-8 uppercase"} />
            <InputOTPSlot index={1} className={"size-8 uppercase"} />
            <InputOTPSlot index={2} className={"size-8 uppercase"} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={3} className={"size-8 uppercase"} />
            <InputOTPSlot index={4} className={"size-8 uppercase"} />
            <InputOTPSlot index={5} className={"size-8 uppercase"} />
          </InputOTPGroup>
        </InputOTP>

        {/* Leave Room Button */}
        <div className="flex gap-2 align-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"sm"} variant="destructive">
                <LogOut className="w-4 h-4" />
                Leave Room
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure to leave this room?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  After leaving, you will not be able to access this room again
                  unless you have the room code.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={leaveRoom}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} variant="outline">
                <UserPlus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Collaborators</DialogTitle>
                <DialogDescription>
                  Share this room ID with others to invite them as
                  Collaborators.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 items-center">
                <InputOTP maxLength={6} value={roomId} disabled>
                  <InputOTPGroup className={""}>
                    <InputOTPSlot index={0} className={"size-8 uppercase"} />
                    <InputOTPSlot index={1} className={"size-8 uppercase"} />
                    <InputOTPSlot index={2} className={"size-8 uppercase"} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className={"size-8 uppercase"} />
                    <InputOTPSlot index={4} className={"size-8 uppercase"} />
                    <InputOTPSlot index={5} className={"size-8 uppercase"} />
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => copyRoomId()}
                >
                  <Copy className="w-4 h-4" />
                  Copy invite link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full" />

      {/* Collaborators */}
      <div className="flex flex-col gap-2 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              {Collaborators.slice(1, 3).map((contributor, index) => (
                <Avatar key={index}>
                  <AvatarImage alt={`@${contributor.name}`} />
                  <AvatarFallback>{contributor.initials}</AvatarFallback>
                </Avatar>
              ))}
              {Collaborators.length > 3 && (
                <Avatar className="bg-gray-200 text-gray-800">
                  <AvatarFallback>+{Collaborators.length - 3}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Collaborators</DialogTitle>
              <DialogDescription>
                View the Collaborators for this room.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {Collaborators.map((contributor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Avatar className="size-8">
                    <AvatarImage alt={`@${contributor.name}`} />
                    <AvatarFallback>{contributor.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{contributor.name}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RoomInfo;

import { colors } from "../lib/utils";
import { Brush, Eraser } from "lucide-react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
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
import RoomInfo from "./room-info";
import { useWhiteboard } from "../hooks/useWhiteboard";

const Toolbar = ({ roomId }) => {
  const { color, setColor, lineWidth, setLineWidth, clearCanvas } =
    useWhiteboard();

  return (
    <div className="flex md:h-36 items-center w-full p-4 shadow-lg border-b relative z-50 gap-4">
      {/* Logo */}
      <div className="flex-1">
        <img src="/logo.svg" alt="Collaborative Paint" className="w-16 h-16" />
      </div>

      {/* Active brush color preview */}
      <div className="flex flex-col gap-2">
        <div
          className="w-10 h-10 rounded-full grid place-items-center border-2 shadow-lg cursor-pointer"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          <Brush size={20} />
        </div>

        {/* Clear canvas confirmation dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eraser className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure to clear the canvas?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                drawings on the canvas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearCanvas}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator orientation="vertical" className="h-full" />

      {/* Color palette + stroke width slider */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {colors.map((clr, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-full border-2 shadow-lg cursor-pointer hover:scale-110 transition"
              style={{ backgroundColor: clr.bg, color: clr.text }}
              onClick={() => setColor(clr)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Slider
            defaultValue={[lineWidth]}
            min={1}
            max={10}
            step={1}
            onValueChange={(val) => setLineWidth(val[0])}
          />
          <Button variant="ghost" size="sm">
            {lineWidth}
          </Button>
        </div>
      </div>

      <Separator orientation="vertical" className="h-full" />

      {/* Room info section */}
      <RoomInfo roomId={roomId} />
    </div>
  );
};

export default Toolbar;

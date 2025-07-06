"use client";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Trash2, Brush, Eraser, User2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useState, useRef, useEffect } from "react";
import { Label } from "./ui/label";
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
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Users2 } from "lucide-react";
import { brushColors } from "@/lib/utils";

function Toolbar({
  onColorChange,
  onWidthChange,
  onClearCanvas,
  currentColor,
  currentWidth,
  roomId,
  userCount,
  activeUsers = {},
}) {
  const [activeTool, setActiveTool] = useState("brush");

  const lastBrushColor = useRef("#000000");

  useEffect(() => {
    if (currentColor !== "#FFFFFF") {
      lastBrushColor.current = currentColor;
    }
  }, [currentColor]);

  const handleToolChange = (tool) => {
    if (!tool) return;

    setActiveTool(tool);
    if (tool === "eraser") {
      onColorChange("#FFFFFF");
    } else {
      onColorChange(lastBrushColor.current);
    }
  };

  const handleColorSelect = (color) => {
    if (!color) return;

    onColorChange(color);

    if (color !== "#FFFFFF") {
      setActiveTool("brush");
    } else {
      if (activeTool !== "eraser") {
        setActiveTool("brush");
      }
    }
  };

  return (
    <div className="shadow p-4 sticky top-0 z-10 w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg mx-auto">
          <span className="text-muted-foreground">Room Code: </span>
          {roomId}
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Users2 className="size-4" />
              {userCount} Online
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Active Members</DialogTitle>
            </DialogHeader>
            <ul className="mt-4 space-y-2">
              {Object.values(activeUsers).map((user, idx) => (
                <li
                  key={idx}
                  className="text-sm flex items-center gap-2 hover:bg-accent p-2 rounded-md cursor-default"
                >
                  <User2 className="size-4" />
                  {user.name || `User-${idx}`}
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex md:flex-row-reverse justify-between flex-col gap-4">
        {/* Tool Selection: Brush or Eraser with clear button */}
        <div className="flex gap-4 justify-between items-center">
          <ToggleGroup
            variant={"outline"}
            type="single"
            value={activeTool}
            onValueChange={handleToolChange}
            aria-label="Select Drawing Tool"
          >
            <ToggleGroupItem
              style={{
                backgroundColor:
                  activeTool === "brush" ? currentColor : "transparent",
                color: activeTool === "brush" ? "#fff" : "#000",
              }}
              value="brush"
              aria-label="Brush Tool"
            >
              <Brush className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              style={{
                border: activeTool === "eraser" ? "1px solid #ccc" : "none",
                backgroundColor:
                  activeTool === "eraser" ? "#f5f5f5" : "transparent",
              }}
              value="eraser"
              aria-label="Eraser Tool"
            >
              <Eraser className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>

          {/*  Clear Buttons */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                aria-label="Clear Canvas"
                className="sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure to clear the canvas?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove all
                  drawings from the canvas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearCanvas}>
                  Clear Canvas
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Color Selection with Size Control */}
        <div className="flex flex-col gap-2 items-center">
          <ToggleGroup
            type="single"
            value={currentColor}
            onValueChange={handleColorSelect}
            className="flex flex-wrap gap-2 justify-center"
            aria-label="Select Drawing Color"
          >
            {brushColors.map((color) => (
              <ToggleGroupItem
                key={color}
                value={color}
                className={`cursor-pointer sm:w-8 sm:h-8 w-6 h-6 first:rounded-full last:rounded-full rounded-full border-2 p-0 flex items-center justify-center
              ${
                currentColor === color
                  ? "ring-2 ring-offset-2 ring-primary"
                  : "border-gray-300"
              }
              `}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color}`}
              ></ToggleGroupItem>
            ))}
            <Label htmlFor="color-picker" className="relative inline-block ">
              {/* Fake Color Display */}
              <div
                className={`sm:w-8 sm:h-8 w-6 h-6 rounded-full border-2 p-0 
                ${
                  !brushColors.includes(currentColor) && activeTool !== "eraser"
                    ? "ring-2 ring-offset-2 ring-primary"
                    : "border-gray-300"
                }`}
                style={{
                  background:
                    "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                }}
              ></div>

              {/* Native Input (hidden visually but still clickable) */}
              <input
                type="color"
                id="color-picker"
                onInput={(e) => onColorChange(e.target.value)}
                className="absolute top-0 left-0 sm:w-8 sm:h-8 w-6 h-6 opacity-0 cursor-pointer"
              />
            </Label>
          </ToggleGroup>

          {/* Stroke Width Slider */}
          <div className="flex items-center gap-4 w-full">
            <Slider
              min={1}
              max={50}
              step={1}
              defaultValue={[currentWidth]}
              value={[currentWidth]}
              onValueChange={([value]) => onWidthChange(value)}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground font-bold whitespace-nowrap">
              {currentWidth}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;

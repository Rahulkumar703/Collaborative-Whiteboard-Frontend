import React from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Trash2 } from "lucide-react";

function Toolbar({
  onColorChange,
  onWidthChange,
  onClearCanvas,
  currentColor,
  currentWidth,
}) {
  const colors = [
    "#000000",
    "#FF0000",
    "#0000FF",
    "#008000",
    "#FF00FF",
    "#FFA500",
  ];

  return (
    <div className="sticky top-0 left-0 z-10 w-full bg-secondary shadow-md p-4 border-b">
      <div className="flex flex-wrap gap-6 items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2 md:w-auto justify-center w-full">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                currentColor === color
                  ? "border-black scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color}`}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 w-60">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Stroke Width:
          </span>
          <div className="flex items-center gap-2 flex-1 w-full">
            <Slider
              min={1}
              max={20}
              step={1}
              defaultValue={[currentWidth]}
              value={[currentWidth]}
              onValueChange={([value]) => onWidthChange(value)}
            />
            <span className="text-sm">{currentWidth}px</span>
          </div>
        </div>

        <Button variant="destructive" onClick={onClearCanvas}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;

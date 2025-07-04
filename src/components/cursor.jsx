import { Pencil } from "lucide-react";
import { Badge } from "./ui/badge";

const Cursor = ({ name = "You", color = "#000", position }) => {
  return (
    <div
      className="absolute z-50 pointer-events-none origin-center"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      {/* Pencil Icon */}
      <Pencil size={24} style={{ color }} className="rotate-[84deg]" />

      {/* Username */}
      <Badge variant={"secondary"} style={{ color }}>
        {name}
      </Badge>
    </div>
  );
};

export default Cursor;

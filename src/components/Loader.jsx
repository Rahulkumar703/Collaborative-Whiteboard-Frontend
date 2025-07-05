import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full gap-4">
      <Loader2 className="animate-spin size-10 text-muted-foreground" />
      <span className="text-2xl text-primary font-semibold">Loading...</span>
    </div>
  );
};

export default Loader;

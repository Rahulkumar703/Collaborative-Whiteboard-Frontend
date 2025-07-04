import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-6">
      <h1 className="text-5xl">404 - Not Found</h1>
      <p className="text-center text-lg mt-4">
        The page you are looking for does not exist.
      </p>
      <Button onClick={() => navigate("/")}>
        <Home className="w-4 h-4" />
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;

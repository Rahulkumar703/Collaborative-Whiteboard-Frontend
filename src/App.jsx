// client/src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RoomPage from "@/pages/RoomPage"; // Import the new RoomPage
import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster />
    </>
  );
}

export default App;

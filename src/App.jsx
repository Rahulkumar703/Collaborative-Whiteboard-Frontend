import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const HomePage = lazy(() => import("@/pages/HomePage"));
const RoomPage = lazy(() => import("@/pages/RoomPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <>
      <div className="App">
        <Suspense
          fallback={<div className="text-center mt-10">Loading...</div>}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Toaster />
    </>
  );
}

export default App;

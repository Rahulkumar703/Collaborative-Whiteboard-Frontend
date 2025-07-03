import { Route, Routes } from "react-router-dom";
import NotFound from "./not-found";
import Home from "./pages/home";
import { WhiteboardProvider } from "./context/WhiteboardProvider";
import { Room } from "./pages/room";

function App() {
  return (
    <WhiteboardProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </WhiteboardProvider>
  );
}

export default App;

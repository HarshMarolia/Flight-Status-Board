import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FlightDetail from "./pages/FlightDetail";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flight/:id" element={<FlightDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
};

export default App;

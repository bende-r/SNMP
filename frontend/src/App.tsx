import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SNMPMonitor from "./pages/SNMPMonitor";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<SNMPMonitor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

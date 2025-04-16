// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth";
import { HomePage } from "./pages/home/home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </Router>
  );
};

export default App;

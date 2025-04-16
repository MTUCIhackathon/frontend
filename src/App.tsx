// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth";
import { HomePage } from "./pages/home/home";
import { TestPage } from "./pages/test/ui/test-page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/tests/:id" element={<TestPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;

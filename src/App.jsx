import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PublishedPage from "./pages/PublishedPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/editor/:id" element={<Editor />} />
        <Route path="/p/:slug" element={<PublishedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

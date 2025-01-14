import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
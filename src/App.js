import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
       <Routes>
         <Route path="/" element={<FeedbackForm />} />
         <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
       </Routes>
       <Footer/>
    </Router>
  );
};

export default App;
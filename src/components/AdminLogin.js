import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post("/api/admin/login", { username, password });
            localStorage.setItem('token', response.data.token);
            setMessage(response.data.message);
            navigate("/admin");
      } catch (err) {
           setMessage(err.response.data.message);
        console.error("Error Logging in Admin", err);
      }
    };

    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
             <div>
                 <label>Username:</label>
                 <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                 />
             </div>
             <div>
                  <label>Password:</label>
                  <input
                     type="password"
                      value={password}
                       onChange={(e) => setPassword(e.target.value)}
                      required
                 />
             </div>
            <button type="submit">Login</button>
        </form>
      </div>
    );
};
export default AdminLogin;
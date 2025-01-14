import React, { useState } from "react";
import axios from "axios";

const AdminRegister = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/admin/register", { username, password });
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response.data.message);
            console.error("Error registering admin:", err);
        }
    };
    return (
        <div className="admin-register-container">
            <h2>Admin Register</h2>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default AdminRegister;
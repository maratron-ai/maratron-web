// src/components/AuthTest.tsx
import React, { useState, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthTest: React.FC = () => {
  const { user, login, logout, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Unexpected error in handleLogin:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "0 auto" }}>
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h2>Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: "1rem" }}>
              Login
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AuthTest;

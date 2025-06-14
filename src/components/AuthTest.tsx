// src/components/AuthTest.tsx
"use client";
import React, { useState, FormEvent } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Spinner } from "@components/ui";

const AuthTest: React.FC = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setLoginError("Invalid email or password.");
    }
    // On success, session will update automatically.
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "0 auto" }}>
      {session?.user ? (
        <>
          <h2>Welcome, {session.user.name || session.user.email}!</h2>
          <p>Email: {session.user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h2>Login</h2>
          {loginError && <p style={{ color: "red" }}>{loginError}</p>}
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

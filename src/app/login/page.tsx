"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@hooks/useAuth";

const LoginPage: React.FC = () => {
  const { user, login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); 
    try {
      await login(email, password);
      router.push("/"); // after successful login, redirect to home page
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // check if user already logged in
  if (user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold">You are logged in!</h1>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // if user not logged in, show log in form
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

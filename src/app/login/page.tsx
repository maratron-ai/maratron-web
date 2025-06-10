"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const LoginPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  ///////////////// REMOVE THIS for prod
  const jacksonLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false, 
      email: "jackson@maratron.ai",
      password: "password",
    });

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/home");
  }

  // Handles form submit using NextAuth signIn
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false, // We'll handle redirection manually
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    // On successful login, redirect to the user home page
    router.push("/home");
  };

  // Show loading state while NextAuth checks session (optional)
  if (status === "loading") {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl">Loading...</h1>
      </main>
    );
  }

  // If already logged in
  if (session?.user) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">You are logged in!</h1>
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/home")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  // If not logged in, show the login form
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Login</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={jacksonLogin}
          className="border px-4 py-2 rounded-md hover:bg-blue-50 transition"
        >
          Jackson login
        </button>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
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
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <div className="text-center my-4">
          <span className="text-gray-500">or</span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          Not registered? Sign up
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
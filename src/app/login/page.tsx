"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Spinner } from "@components/ui";

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
        <div className="flex justify-center py-4">
          <Spinner className="h-4 w-4" />
        </div>
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
            className="bg-primary text-foreground px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  // If not logged in, show the login form
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        {error && <p className="text-brand-orange-dark text-center">{error}</p>}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={jacksonLogin}
            className="border px-4 py-2 rounded-md hover:bg-accent/20 transition"
          >
            Jackson login
          </button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm mx-auto">
          <div className="mb-4">
            <label htmlFor="email" className="block text-foreground mb-2">
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
            <label htmlFor="password" className="block text-foreground mb-2">
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
            className="w-full bg-primary text-foreground py-2 rounded-md hover:bg-primary/80 transition-colors"
          >
            Login
          </button>
          <div className="text-center my-4">
            <span className="text-foreground/80">or</span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full border border-primary text-primary py-2 rounded-md hover:bg-primary/20 transition-colors"
          >
            Not registered? Sign up
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
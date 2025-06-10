"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Input, Label, Button } from "@components/ui";

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
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  // If already logged in
  if (session?.user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold">You are logged in!</h1>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => router.push("/home")}>Go Home</Button>
        </div>
      </div>
    );
  }

  // If not logged in, show the login form
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="flex justify-center mb-4">
        <Button type="button" variant="outline" onClick={jacksonLogin}
          className="w-half">
          Jackson login
        </Button>
      </div>
      <form onSubmit={handleLogin} className="max-w-md mx-auto">
        <div className="mb-4 space-y-2">
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 space-y-2">
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Login</Button>
        <div className="text-center my-4">
          <span className="text-gray-500">or</span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/signup")}
        >
          Not registered? Sign up
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;

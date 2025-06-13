"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createUser } from "@lib/api/user/user";
import { Card, Input, Label, Button } from "@components/ui";


export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const createUserRes = await createUser({ name, email });

      if (createUserRes?.status === 201 || createUserRes?.status === 200) {
        // Now sign in the new user
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInRes?.ok) {
          router.push("/signup/profile");
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Failed to create user.");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="relative w-full px-4 sm:px-6 lg:px-8 flex justify-center">
          <Card className="w-full max-w-md p-8 bg-white/90 dark:bg-white/10 shadow-xl space-y-6">
            <h1 className="text-3xl font-bold text-center">Create Your Account</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white border-0 hover:from-[var(--brand-from)]/90 hover:to-[var(--brand-to)]/90"
              >
                Sign Up
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}

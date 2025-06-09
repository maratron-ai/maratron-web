"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createUserProfile, uploadAvatar } from "@lib/api/user/user"; // Adjust path if necessary


export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadAvatar(file);
    setAvatarUrl(url);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const createUserRes = await createUserProfile({ name, email, avatarUrl });

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
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block mb-1">Profile Picture</label>
            <input
              type="url"
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:ring-2 focus:ring-primary"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>
          {avatarUrl && (
            <div className="flex justify-center">
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createUserProfile, uploadAvatar } from "@lib/api/user/user"; // Adjust path if necessary
import { Input, Label, Button, Card } from "@components/ui";
import Image from "next/image";


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
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-red-500">{error}</p>}
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
            <Label htmlFor="avatar">Profile Picture</Label>
            <Input
              id="avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {avatarUrl && (
            <div className="flex justify-center">
              <Image
                src={avatarUrl}
                alt="Avatar preview"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </Card>
    </main>
  );
}

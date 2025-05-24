// src/app/(auth)/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}

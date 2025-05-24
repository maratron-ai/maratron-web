"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 text-white px-4 py-2">
      <ul className="flex space-x-6 items-center">
        <li>
          <Link href="/" className="hover:underline">
            Landing (/)
          </Link>
        </li>
        <li>
          <Link href="/home" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/signup" className="hover:underline">
            Sign Up
          </Link>
        </li>
        <li>
          <Link href="/testing" className="hover:underline">
            testing
          </Link>
        </li>
        <li>
          <Link href="/userProfile" className="hover:underline">
            User Profile
          </Link>
        </li>
        <li>
          <Link href="/plan-generator" className="hover:underline">
            Plan Generator Page
          </Link>
        </li>

        {/* AUTH BUTTONS/STATUS */}
        <li className="ml-auto flex items-center space-x-4">
          {status === "loading" ? (
            <span>Loading...</span>
          ) : session?.user ? (
            <>
              <span className="text-gray-400">
                Welcome, {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

"use client"; // This is a client component since it uses Next.js Link

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2">
      <ul className="flex space-x-6">
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
        {/* Add additional links as needed */}
      </ul>
    </nav>
  );
}

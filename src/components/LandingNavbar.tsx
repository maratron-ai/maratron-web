"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-center items-center">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="bg-transparent focus:outline-none hover:bg-transparent focus:ring-0"
          >
            <Image
              src="/maratron-name.svg"
              alt="Maratron Logo"
              width={300}
              height={80}
            />
          </button>

          {menuOpen && (
            <div
              className="
                absolute
                top-full
                left-1/2
                transform -translate-x-1/2
                mt-4
                bg-white/30
                // rounded-md
                shadow-lg
                flex
                gap-x-6
                px-4
                py-2
                w-64              /* ← make the popup 16rem wide */
                z-30
                w-full
              "
            >
              <Link
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
              >
                Learn More
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

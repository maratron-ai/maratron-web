"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/plan-generator", label: "Plans" },
  ];

  return (
    <nav className="bg-background border-b border-accent/20">
      <div className="container flex items-center justify-between py-4">
        {/* Left: Logo and links */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-4">
            Maratron
          </Link>
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: utilities and session */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Utility icons */}
          <Link href="#" className="text-foreground hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 13.5A8.25 8.25 0 0112 5.25a8.25 8.25 0 019.75 8.25 8.25 8.25 0 01-9.75 8.25A8.25 8.25 0 012.25 13.5zm8.25 0a.75.75 0 101.5 0 .75.75 0 00-1.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link href="#" className="text-foreground hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M12 1.5a9 9 0 100 18 9 9 0 000-18zM8.25 12a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm5.25 0a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
            </svg>
          </Link>

          {status === "loading" ? null : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="focus:outline-none"
              >
                <Image
                  src={session.user.image || "/next.svg"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-background border border-accent/20 rounded shadow-md">
                  <Link
                    href="/userProfile"
                    className="block px-4 py-2 hover:bg-accent/20"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-accent/20"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-accent/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          {status !== "loading" && session?.user && (
            <div className="relative mr-2">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="focus:outline-none"
              >
                <Image
                  src={session.user.image || "/next.svg"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-background border border-accent/20 rounded shadow-md">
                  <Link
                    href="/userProfile"
                    className="block px-4 py-2 hover:bg-accent/20"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-accent/20"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-accent/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${mobileOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          {status !== "loading" && session?.user ? (
            <>
              <Link
                href="/userProfile"
                className="block py-2 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block py-2 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="w-full text-left py-2 hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                signIn();
                setMobileOpen(false);
              }}
              className="w-full text-left py-2 hover:text-primary"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

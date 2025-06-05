"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/runs/new", label: "Add Run" },
    { href: "/shoes/new", label: "Add Shoe" },
    { href: "/plan-generator", label: "Plans" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-background border-b border-accent/20">
      <div className="w-full px-4 md:px-8 flex items-center justify-between py-4">
        {/* Left: Logo and links */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-2">
            <Image
              src="/maratron-name.svg"
              alt="Maratron Logo"
              width={160}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden md:flex space-x-4">
            {status !== "loading" && session?.user ? (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right: utilities and session (desktop) */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          {status === "loading" ? null : session?.user ? (
            <>
              {/* User Avatar + Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDesktopMenuOpen((o) => !o)}
                  aria-label="Toggle user menu"
                  aria-expanded={desktopMenuOpen}
                  className="focus:outline-none bg-transparent p-0 hover:bg-transparent focus:ring-0"
                >
                  <Image
                    src={session.user.image || "/Default_pfp.svg"}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>
                {desktopMenuOpen && (
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
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger and Avatar */}
        <div className="md:hidden flex items-center">
          {/* Avatar (mobile) */}
          {status !== "loading" && session?.user && (
            <div className="relative mr-2">
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Toggle user menu"
                aria-expanded={mobileMenuOpen}
                className="focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {" "}
                  <Image
                    src={session.user.image || "/Default_pfp.svg"}
                    alt="avatar"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
              </button>
              {mobileMenuOpen && (
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
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-accent/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger icon (mobile) */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
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
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1">
          {status !== "loading" && session?.user ? (
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))
          ) : (
            <Link
              href="/about"
              className="block py-2 hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
          )}

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

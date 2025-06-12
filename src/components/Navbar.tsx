"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu } from "lucide-react";
import DefaultAvatar from "@components/DefaultAvatar";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui";
import ModeToggle from "@components/ModeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
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
    <nav className="bg-white dark:bg-[#111827] border-b border-muted dark:border-white/10 backdrop-blur-sm relative z-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-6">
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
                  {session.user.avatarUrl ? (
                    <Image
                      src={session.user.avatarUrl}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar
                      seed={session.user.id || session.user.email || ""}
                      size={32}
                    />
                  )}
                </button>
                {desktopMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-background border border-accent/20 rounded shadow-md z-50">
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
          <ModeToggle />
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
                  {session.user.avatarUrl ? (
                    <Image
                      src={session.user.avatarUrl}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  ) : (
                    <DefaultAvatar
                      seed={session.user.id || session.user.email || ""}
                      size={32}
                    />
                  )}
                </div>
              </button>
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-background border border-accent/20 rounded shadow-md z-50">
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
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Toggle mobile menu"
                className="p-2 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6 space-y-4">
              {status !== "loading" && session?.user ? (
                navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block">
                    {link.label}
                  </Link>
                ))
              ) : (
                <Link href="/about" className="block">
                  About
                </Link>
              )}
              <hr />
              {status !== "loading" && session?.user ? (
                <>
                  <Link href="/userProfile" className="block">
                    Profile
                  </Link>
                  <Link href="/settings" className="block">
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={() => signIn()} className="w-full text-left">
                  Sign In
                </button>
              )}
              <ModeToggle />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

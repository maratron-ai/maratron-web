"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import DefaultAvatar from "@components/DefaultAvatar";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui";
// import ModeToggle from "@components/ModeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // const router = useRouter();

  // Close dropdowns when route changes
  useEffect(() => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Auto-close dropdowns after 5 seconds
  useEffect(() => {
    if (desktopMenuOpen) {
      const timer = setTimeout(() => setDesktopMenuOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [desktopMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      const timer = setTimeout(() => setMobileMenuOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/social", label: "Social" },
    { href: "/social/feed", label: "Social Feed" },
    { href: "/social/search", label: "Find Runners" },
    { href: "/social/groups", label: "Groups" }
  ];

  return (
    <nav className="bg-background border-b border-transparent backdrop-blur-sm relative z-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-6">
        {/* Left: Logo and links */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-2">
            <div className="relative w-auto px-8">
              {/* Light-mode logo */}
              <Image
                src="/maratron-name-dark.svg"
                alt="Maratron Logo"
                width={140}
                height={60}
                className="block dark:hidden"
              />
              {/* Dark-mode logo */}
              <Image
                src="/maratron-name-light.svg"
                alt="Maratron Logo"
                width={140}
                height={60}
                className="hidden dark:block"
              />
            </div>
          </Link>
          <div className="hidden md:flex space-x-4">
            {status !== "loading" && session?.user ? (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                      text-foreground 
                      no-underline 
                      transition-colors 
                      hover:text-background 
                      hover:no-underline
                      hover:bg-brand-from
                    "
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-foreground no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-foreground no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
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
                  {session.user?.avatarUrl ? (
                    <Image
                      src={session.user.avatarUrl}
                      alt={session.user.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-muted bg-muted"
                      priority
                    />
                  ) : (
                    <DefaultAvatar
                      size={32}
                      className="border border-brand-to bg-brand-from"
                    />
                  )}
                </button>
                {desktopMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-background border border-accent rounded shadow-md z-50 flex flex-col items-center">
                    <Link
                      href="/profile"
                      className="block w-full text-center py-2 bg-transparent justify-center text-foreground no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block w-full text-center py-2 bg-transparent justify-center text-foreground no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-center py-2 bg-transparent justify-center text-foreground no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
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
              className="text-foreground no-underline transition-colors bg-transparent hover:text-background hover:no-underline hover:bg-brand-from"
            >
              Sign In
            </button>
          )}
          {/* <ModeToggle /> */}
        </div>

        {/* Mobile Hamburger and Avatar */}
        <div className="md:hidden flex items-center">
          {/* Avatar (mobile) */}
          {status !== "loading" && session?.user && (
            <button
              onClick={() => setDesktopMenuOpen((o) => !o)}
              aria-label="Toggle user menu"
              aria-expanded={desktopMenuOpen}
              className="focus:outline-none bg-transparent p-4 hover:bg-transparent focus:ring-0"
            >
              {session.user?.avatarUrl ? (
                <Image
                  src={session.user.avatarUrl}
                  alt={session.user.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-muted bg-muted"
                  priority
                />
              ) : (
                <DefaultAvatar
                  size={32}
                  className="border border-brand-to bg-brand-from"
                />
              )}
            </button>
          )}

          {/* Hamburger icon (mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Toggle mobile menu"
                className="p-2 focus:outline-none bg-transparent hover:bg-transparent focus:ring-0 hover:text-primary transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6 space-y-4 w-1/2">
              {status !== "loading" && session?.user ? (
                navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block mx-auto w-auto text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <Link
                  href="/about"
                  className="block mx-auto w-auto text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                >
                  About
                </Link>
              )}
              <hr />
              {status !== "loading" && session?.user ? (
                <>
                  <Link
                    href="/profile"
                    className="block mx-auto w-auto text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block mx-auto w-auto text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block mx-auto w-auto text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from border-none"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-foreground no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
                >
                  Sign In
                </button>
              )}
              {/* <ModeToggle /> */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

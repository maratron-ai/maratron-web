import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import NewsletterSignup from "@components/NewsletterSignup";
import ContactForm from "@components/ContactForm";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-background border-t border-muted text-sm text-foreground relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Image src="/maratron-name.svg" alt="Maratron wordmark" width={120} height={40} />
            <NewsletterSignup />
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/maratron.ai/" aria-label="Instagram" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Navigate</h3>
            <ul className="space-y-1">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/plans">Plans</Link></li>
              <li><Link href="/social">Social</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Sitemap</h3>
            <ul className="space-y-1">
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/signup">Signup</Link></li>
              <li><Link href="/home">Dashboard</Link></li>
              <li><Link href="/plans">Plans</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-1"><Mail className="h-4 w-4" />Contact Us</h3>
            <p className="text-muted-foreground">info@maratron.ai</p>
            <ContactForm />
          </div>
        </div>
        <div className="pt-8 border-t border-muted text-center">
          <p>&copy; {year} Maratron. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

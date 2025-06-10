import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-8 text-center text-foreground/60 text-sm bg-background border-t border-accent/10 relative z-10">
      <div className="container mx-auto px-4 max-w-screen-lg space-y-2">
        <Image
          src="/maratron-name.svg"
          alt="Maratron wordmark"
          width={100}
          height={30}
          className="mx-auto"
        />
        <div className="space-x-4">
          <a href="/about">About</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
        <div>&copy; {new Date().getFullYear()} Maratron. All rights reserved.</div>
      </div>
    </footer>
  );
}

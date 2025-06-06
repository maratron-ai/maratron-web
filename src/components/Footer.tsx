import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-8 text-center text-foreground/60 text-sm bg-background border-t border-accent/10 relative z-10">
      <Image
        src="/maratron-name.svg"
        alt="Maratron wordmark"
        width={100}
        height={30}
        className="mx-auto mb-2"
      />
      &copy; {new Date().getFullYear()} Maratron. All rights reserved.
    </footer>
  );
}

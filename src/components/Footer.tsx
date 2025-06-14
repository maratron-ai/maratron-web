import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-8 text-center text-foreground/60 text-sm bg-background border-t border-muted relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-2">
        <Image
          src="/maratron-name.svg"
          alt="Maratron wordmark"
          width={100}
          height={30}
          className="mx-auto"
        />
        <div className="space-x-4">
          <a href="/about">About</a>
          {/* <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a> */}
          <a
            href="https://www.instagram.com/maratron.ai/"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Maratron. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

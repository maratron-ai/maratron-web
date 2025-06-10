// src/app/layout.tsx
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@components/Providers";
import Navbar from "@components/Navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Maratron",
  description: "Maratron AI description",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="antialiased">
        <Providers>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

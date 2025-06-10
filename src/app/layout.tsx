// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@components/Providers";
import Navbar from "@components/Navbar";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>
          <div className="container mx-auto px-4 max-w-screen-lg">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

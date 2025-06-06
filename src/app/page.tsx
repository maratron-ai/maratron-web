"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-background to-accent/20"
      >
        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Run Smarter with Maratron
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-foreground/80 mb-8">
          AI-driven training plans and real-time insights built for runners of every level.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Get Started
        </Link>
        <button
          onClick={scrollToFeatures}
          aria-label="Scroll down"
          className="mt-12 animate-bounce text-primary"
        >
          ▼
        </button>
      </motion.section>

      {/* Features */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 bg-accent/10 px-4"
      >
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-primary text-4xl">🔥</div>
            <h3 className="text-xl font-semibold">Personalized Plans</h3>
            <p className="text-sm text-foreground/80">
              Tailored workouts that adapt to your progress.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-primary text-4xl">📊</div>
            <h3 className="text-xl font-semibold">Insightful Analytics</h3>
            <p className="text-sm text-foreground/80">
              Track pace, distance, and more with powerful metrics.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-primary text-4xl">🤝</div>
            <h3 className="text-xl font-semibold">Community Support</h3>
            <p className="text-sm text-foreground/80">
              Stay motivated with challenges and leaderboards.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-24 text-center px-4"
      >
        <h2 className="text-3xl font-bold mb-6">Join Thousands of Runners</h2>
        <p className="text-lg max-w-xl mx-auto text-foreground/80 mb-8">
          See why athletes trust Maratron to smash their next PR.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
        >
          Start Training
        </Link>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-background/80 border-t border-accent/20 py-8 text-center text-foreground/80"
      >
        <p>&copy; {new Date().getFullYear()} marathon.ai. All rights reserved.</p>
      </motion.footer>
    </main>
  );
}


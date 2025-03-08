// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Maratron</h1>
        <p className="text-xl mb-8">
          Your AI running coach for optimized coaching, training planning, and
          run recording.
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Optimized Coaching</h3>
            <p>
              Receive personalized coaching based on your performance and
              running data.
            </p>
          </div>
          <div className="p-6 border rounded shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Training Planning</h3>
            <p>
              Build smart, adaptive training plans tailored to your fitness
              level and goals.
            </p>
          </div>
          <div className="p-6 border rounded shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Run Recording</h3>
            <p>
              Log and analyze your runs with detailed metrics to track your
              progress.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-4 bg-accent">
        <h2 className="text-3xl font-bold text-center mb-8">Why Maratron?</h2>
        <p className="max-w-3xl mx-auto text-lg text-center">
          Maratron leverages advanced AI algorithms to provide coaching and
          training insights that evolve with you. Whether you're a beginner or a
          seasoned runner, our app adapts to your needs, ensuring every run
          counts.
        </p>
      </section>
    </main>
  );
}

// src/app/about/page.tsx
import { Card } from "@components/ui";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-prose p-6 text-center space-y-4">
        <h1 className="text-3xl font-bold">About Maratron</h1>
        <p className="text-lg">
          Maratron is your AI-powered running coach, helping you train smarter,
          stay motivated, and achieve your goals—one step at a time.
        </p>
      </Card>
    </main>
  );
}

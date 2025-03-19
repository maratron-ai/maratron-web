"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  text: string;
  isBot: boolean;
}

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Simulated bot response
  async function getBotResponse(prompt: string) {
    return `An AI-powered running coach providing tailored training plans for your goal of ${prompt}. We'll focus on:
- Pace optimization
- Muscle recovery
- Race strategy
- Performance metrics analysis`;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = { text: inputMessage, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    setTimeout(async () => {
      const botResponseText = await getBotResponse(userMessage.text);
      const botMessage: Message = { text: botResponseText, isBot: true };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header & Navigation */}
      <header className="bg-background/90 backdrop-blur-md border-b border-accent/20 fixed w-full z-50">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary">marathon.ai</h1>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/training-plan"
              className="text-foreground hover:text-primary transition-colors"
            >
              Training Plan
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container text-center">
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Transform Your Running Experience
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/80">
            Experience the future of running with AI-powered coaching that
            adapts to your goals and performance.
          </p>
        </div>
      </section>

      {/* Chat Widget Section */}
      <section className="container py-12">
        <div className="bg-background/80 backdrop-blur-lg rounded-xl border border-accent/20 shadow-2xl p-6">
          <div className="mb-4 h-96 overflow-y-auto border-b border-accent/20 p-4">
            {messages.length === 0 ? (
              <p className="text-foreground/50 text-center">
                Start a conversation with our AI coach...
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-md p-4 rounded-lg ${
                      msg.isBot
                        ? "bg-primary/10 text-primary"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-background border border-accent/20 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Send
            </button>
          </form>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-background/80 backdrop-blur-lg py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            About marathon.ai
          </h2>
          <p className="max-w-3xl mx-auto text-foreground/80 mb-8">
            marathon.ai is an innovative AI-powered running coach designed to
            help you achieve peak performance. Leveraging advanced machine
            learning algorithms, we create personalized training plans tailored
            to your unique needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Key Features
              </h3>
              <ul className="list-disc list-inside text-foreground/80 space-y-2">
                <li>AI-powered training plans</li>
                <li>Personalized workout strategies</li>
                <li>In-depth performance analysis</li>
                <li>Real-time insights</li>
                <li>Customizable goals</li>
                <li>Expert running advice</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Quick Start Guide
              </h3>
              <ol className="list-decimal list-inside text-foreground/80 space-y-2">
                <li>Create an account or log in</li>
                <li>Select your running goals</li>
                <li>Enter your training details</li>
                <li>Start your personalized plan</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-primary text-center mb-8">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto">
          <ul className="space-y-4 text-foreground/80 text-lg">
            <li>Create a personalized training plan</li>
            <li>Track your progress with detailed metrics</li>
            <li>Receive tailored running tips and advice</li>
            <li>Optimize your race strategy for peak performance</li>
            <li>Analyze and improve your running performance</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-lg border-t border-accent/20 py-8">
        <div className="container text-center text-foreground/80">
          <p>
            &copy; {new Date().getFullYear()} marathon.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import {
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Award,
  Target,
  Watch,
  TrendingUp,
  Clock,
  Brain,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-blue-50 to-orange-50 dark:from-orange-950/20 dark:via-blue-950/20 dark:to-orange-950/20"></div>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="w-full text-center">
            <Badge className="mb-6 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white border-0">
              Powered by Advanced AI Training Science
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Your Personal Marathon Coach, Reimagined
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed mx-auto max-w-screen-md px-4">
              Break through plateaus and achieve your marathon dreams with AI-powered training that adapts to you. No more rigid plans—just intelligent coaching that evolves with every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:from-[var(--brand-from)]/90 hover:to-[var(--brand-to)]/90 text-white border-0 text-lg px-8 py-6">
                Start Your Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Training That Actually <span className="text-gradient bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] bg-clip-text text-transparent">Gets You There</span>
            </h2>
            <p className="text-xl text-muted-foreground mx-auto max-w-screen-md px-4">
              Stop guessing. Start succeeding. Maratron combines cutting-edge AI with proven training science to create your perfect marathon journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Personalization</h3>
              <p className="text-muted-foreground">
                Your training adapts weekly based on your progress, recovery, and life. No more one-size-fits-all plans that ignore your reality.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-blue)] rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">VO₂ Max & Race Prediction</h3>
              <p className="text-muted-foreground">
                Know exactly what you&apos;re capable of. Our AI predicts your race times and tracks fitness improvements with scientific precision.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-[var(--brand-from)] to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-6">
                <Watch className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Seamless Device Integration</h3>
              <p className="text-muted-foreground">
                Connect your Garmin, Apple Watch, or other devices. Your workouts sync automatically—no manual logging required.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Load Management</h3>
              <p className="text-muted-foreground">
                Built on ACWR principles to prevent injury and optimize performance. Train harder when you can, recover when you need to.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-red-50 to-white dark:from-red-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Perfect Tapering</h3>
              <p className="text-muted-foreground">
                Arrive at race day fresh and fast. Our AI crafts the ideal taper based on your training load and race goals.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-[var(--brand-from)] to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Proven Science</h3>
              <p className="text-muted-foreground">
                Built on Jack Daniels&apos; VDOT formula and modern training science. Trust in methods that have created champions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section id="science" className="py-20 bg-muted/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Backed by Science, Powered by <span className="text-gradient bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] bg-clip-text text-transparent">Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              We don&apos;t just use buzzwords—we implement proven methodologies that elite coaches have used for decades, now enhanced with AI precision.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-left">
                <h3 className="text-2xl font-semibold mb-4">Jack Daniels&apos; VDOT</h3>
                <p className="text-muted-foreground mb-4">
                  The gold standard in running science. Our AI implements Dr. Daniels&apos; proven training zones and pacing strategies, adapting them to your unique physiology and progress.
                </p>
                <div className="text-sm text-[var(--brand-orange-dark)] font-medium">Used by Olympic athletes worldwide</div>
              </Card>
              
              <Card className="p-8 text-left">
                <h3 className="text-2xl font-semibold mb-4">ACWR Load Management</h3>
                <p className="text-muted-foreground mb-4">
                  Acute to Chronic Workload Ratio prevents injury by monitoring your training stress. Our AI constantly calculates the sweet spot between progression and safety.
                </p>
                <div className="text-sm text-[var(--brand-blue)] font-medium">Reduces injury risk by up to 60%</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real Runners, Real <span className="text-gradient bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] bg-clip-text text-transparent">Results</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of runners who&apos;ve shattered their personal bests with Maratron
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 bg-gradient-to-br from-white to-orange-50 dark:from-background dark:to-orange-950/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">First-time marathoner</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;I went from struggling with 5Ks to finishing my first marathon in 3:45. Maratron made it feel achievable every step of the way.&quot;
              </p>
              <div className="text-sm font-medium text-[var(--brand-orange-dark)]">
                Improved by 47 minutes from goal time
              </div>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-background dark:to-blue-950/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--brand-blue)] rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Mike Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Veteran runner</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;After years of the same training, I was stuck at 3:20. Maratron&apos;s AI found gaps I never knew existed. New PR: 3:02!&quot;
              </p>
              <div className="text-sm font-medium text-[var(--brand-blue)]">
                18-minute personal best after 3 years
              </div>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-background to-[var(--brand-from)]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-foreground font-bold">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Amanda Park</div>
                  <div className="text-sm text-muted-foreground">Busy professional</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;With work and kids, I thought Boston was impossible. Maratron adapted to my chaotic schedule and got me there.&quot;
              </p>
              <div className="text-sm font-medium text-primary">
                Boston qualifier on limited training time
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-from)] via-[var(--brand-to)] to-[var(--brand-purple)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="w-full text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Rewrite Your Running Story?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the thousands of runners who&apos;ve discovered what&apos;s possible when science meets personalization. Your breakthrough is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-background text-foreground hover:bg-accent/10 text-lg px-8 py-6">
                Start Your Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                <PlayCircle className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Start your 14-day free trial today. No commitment, just results.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

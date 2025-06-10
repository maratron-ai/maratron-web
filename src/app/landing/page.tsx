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
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold">Maratron</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#science" className="text-muted-foreground hover:text-foreground transition-colors">Science</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</a>
            <Button variant="outline" size="sm">Log In</Button>
            <Button size="sm">Start Free Trial</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-blue-50 to-orange-50 dark:from-orange-950/20 dark:via-blue-950/20 dark:to-orange-950/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-blue-600 text-white border-0">
              Powered by Advanced AI Training Science
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Your Personal Marathon Coach, Reimagined
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Break through plateaus and achieve your marathon dreams with AI-powered training that adapts to you. No more rigid plans—just intelligent coaching that evolves with every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white border-0 text-lg px-8 py-6">
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
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Training That Actually <span className="text-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">Gets You There</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop guessing. Start succeeding. Maratron combines cutting-edge AI with proven training science to create your perfect marathon journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Personalization</h3>
              <p className="text-muted-foreground">
                Your training adapts weekly based on your progress, recovery, and life. No more one-size-fits-all plans that ignore your reality.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">VO₂ Max & Race Prediction</h3>
              <p className="text-muted-foreground">
                Know exactly what you&apos;re capable of. Our AI predicts your race times and tracks fitness improvements with scientific precision.
              </p>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-green-50 to-white dark:from-green-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
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

            <Card className="p-8 border-0 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/10 dark:to-background hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-6">
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
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Backed by Science, Powered by <span className="text-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">Intelligence</span>
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
                <div className="text-sm text-orange-600 font-medium">Used by Olympic athletes worldwide</div>
              </Card>
              
              <Card className="p-8 text-left">
                <h3 className="text-2xl font-semibold mb-4">ACWR Load Management</h3>
                <p className="text-muted-foreground mb-4">
                  Acute to Chronic Workload Ratio prevents injury by monitoring your training stress. Our AI constantly calculates the sweet spot between progression and safety.
                </p>
                <div className="text-sm text-blue-600 font-medium">Reduces injury risk by up to 60%</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real Runners, Real <span className="text-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">Results</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of runners who&apos;ve shattered their personal bests with Maratron
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 bg-gradient-to-br from-white to-orange-50 dark:from-background dark:to-orange-950/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
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
              <div className="text-sm font-medium text-orange-600">
                Improved by 47 minutes from goal time
              </div>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-background dark:to-blue-950/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
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
              <div className="text-sm font-medium text-blue-600">
                18-minute personal best after 3 years
              </div>
            </Card>

            <Card className="p-8 border-0 bg-gradient-to-br from-white to-green-50 dark:from-background dark:to-green-950/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
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
              <div className="text-sm font-medium text-green-600">
                Boston qualifier on limited training time
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Rewrite Your Running Story?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the thousands of runners who&apos;ve discovered what&apos;s possible when science meets personalization. Your breakthrough is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6">
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

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold">Maratron</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Your AI-powered marathon coach that adapts, evolves, and inspires. Because every runner deserves a plan that works for them.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>© 2024 Maratron</span>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#" className="block hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="block hover:text-foreground transition-colors">Integrations</a>
                <a href="#" className="block hover:text-foreground transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact Us</a>
                <a href="#" className="block hover:text-foreground transition-colors">Community</a>
                <a href="#" className="block hover:text-foreground transition-colors">Blog</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

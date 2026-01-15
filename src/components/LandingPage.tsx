import { useState } from "react";
import { Zap, Trophy, Users, Clock, Shield, Star, ChevronRight, UserPlus, CreditCard, Target, Play } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [activeSection, setActiveSection] = useState("features");

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold text-primary">GLORY BOT</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Features</button>
            <button onClick={() => scrollToSection("how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">How It Works</button>
            <button onClick={() => scrollToSection("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Pricing</button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Reviews</button>
          </nav>
          <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
            DASHBOARD
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Dominate Your <span className="text-primary">Clan Glory</span>
            <br />Automatically
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            The most advanced Free Fire clan glory automation system. Boost your clan's ranking while you sleep with our intelligent bot technology.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-12 mb-10">
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">40M+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Glory Earned Daily</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-basic">101%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Uptime</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-premium">50+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Users</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg">
              <Zap className="w-5 h-5 mr-2" />
              GET STARTED NOW
            </Button>
            <Button variant="outline" onClick={() => scrollToSection("how-it-works")} className="px-8 py-6 text-lg border-border">
              <Play className="w-5 h-5 mr-2" />
              HOW IT WORKS
            </Button>
          </div>

          {/* Live Stats Card */}
          <div className="mt-16 max-w-md mx-auto">
            <div className="card-gaming-bordered p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Live Glory Stats</p>
                  <p className="text-xs text-muted-foreground">Real-time monitoring</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Daily Progress</span>
                  <span>78%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[78%] rounded-full" />
                </div>
              </div>
              <p className="font-display text-2xl text-primary text-center mb-4">+12 M Glory</p>
              <div className="flex justify-center gap-4">
                <div className="bg-secondary/50 px-4 py-2 rounded-lg text-center">
                  <p className="font-bold">4</p>
                  <p className="text-xs text-muted-foreground">BOTS ACTIVE</p>
                </div>
                <div className="bg-secondary/50 px-4 py-2 rounded-lg text-center">
                  <p className="font-bold">24/7</p>
                  <p className="text-xs text-muted-foreground">RUNNING</p>
                </div>
                <div className="bg-secondary/50 px-4 py-2 rounded-lg text-center">
                  <p className="font-bold">ME</p>
                  <p className="text-xs text-muted-foreground">REGION</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wide mb-4">Process</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold">How It <span className="text-primary">Works</span></h2>
            <p className="text-muted-foreground mt-4">Get started with Glory Bot in just a few simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { num: "01", icon: UserPlus, title: "Create Account", desc: "Sign up for a free account and get access to your personal dashboard." },
              { num: "02", icon: CreditCard, title: "Add Credits", desc: "Purchase credits to power your glory farming sessions." },
              { num: "03", icon: Target, title: "Enter Clan ID", desc: "Input your Free Fire clan ID and select your preferred region." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="relative inline-block mb-6">
                  <span className="font-display text-6xl font-bold text-primary/20">{step.num}</span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="relative inline-block mb-6">
              <span className="font-display text-6xl font-bold text-primary/20">04</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Watch Glory Grow</h3>
            <p className="text-sm text-muted-foreground">Sit back and watch as your clan glory increases automatically!</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wide mb-4">Pricing</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Simple <span className="text-primary">Pricing</span></h2>
            <p className="text-muted-foreground mt-4">Choose the plan that fits your needs. No hidden fees, cancel anytime.</p>
          </div>

          <div className="card-gaming-bordered p-8 max-w-md mx-auto relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase">Most Popular</span>
            </div>
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground mb-6">Most popular choice</p>
              <div className="mb-6">
                <span className="text-muted-foreground text-xl">$</span>
                <span className="font-display text-5xl font-bold">20</span>
              </div>
              <p className="text-muted-foreground mb-8">3 Credits</p>
              
              <div className="space-y-4 text-left mb-8">
                {["3 Glory Sessions", "Full Dashboard Access", "Priority Support", "3 Active Groups", "Auto-Refund Feature"].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button onClick={onGetStarted} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
                GET STARTED
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wide mb-4">Testimonials</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold">What Players <span className="text-primary">Say</span></h2>
            <p className="text-muted-foreground mt-4">Join thousands of satisfied clan leaders who trust Glory Bot.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { name: "Ahmed K.", role: "Clan Leader - Desert Storm", quote: "Glory Bot completely changed our clan's ranking. We went from Top 100 to Top 10 in just two weeks. The automation is flawless!", rating: 5 },
              { name: "Raj S.", role: "Clan Officer - Phoenix Rising", quote: "The refund system is amazing. Had an issue with one session and got my credit back instantly. Best customer service I've experienced!", rating: 5 },
            ].map((review, i) => (
              <div key={i} className="card-gaming-bordered p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{review.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {review.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-gaming-bordered p-6 max-w-md">
            <div className="flex gap-1 mb-4">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
              <Star className="w-4 h-4 text-primary" />
            </div>
            <p className="text-muted-foreground mb-6 italic">"Easy to use, great dashboard, and consistent results. We've been using Glory Bot for 3 months now and couldn't be happier with the results."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">MH</div>
              <div>
                <p className="font-semibold text-sm">Mohammed H.</p>
                <p className="text-xs text-muted-foreground">Clan Leader - Night Wolves</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card-gaming-bordered p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Dominate the Leaderboards?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of clan leaders who are already using Glory Bot to maximize their clan's potential.</p>
              <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg">
                <Trophy className="w-5 h-5 mr-2" />
                START YOUR JOURNEY NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="font-display text-lg font-bold text-primary">GLORY BOT</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">The most advanced Free Fire clan glory automation system. Dominate your competition effortlessly.</p>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-foreground transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection("reviews")} className="hover:text-foreground transition-colors">Reviews</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wide">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>FAQ</li>
                <li>Contact Us</li>
                <li>Discord Server</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Glory Bot. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Made with ❤️ for Free Fire Players</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

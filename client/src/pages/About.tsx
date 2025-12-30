import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Leaf, Users, Target, Heart, CheckCircle2, Microscope, ChevronRight } from "lucide-react";
// Breadcrumb styling moved to custom implementation
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, var(--optibio-sky-light) 0%, var(--optibio-sky-mid) 40%, var(--optibio-sky-deep) 100%)' }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--optibio-gold)]/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[var(--optibio-navy)]/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative z-10">
          <nav className="flex items-center gap-2 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-2 h-6">
            <a href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors leading-none flex items-center">
              Home
            </a>
            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
            <span className="text-[var(--optibio-navy)] font-bold leading-none flex items-center">
              About
            </span>
          </nav>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-3 py-1 bg-[var(--optibio-gold)]/10 border border-[var(--optibio-gold)]/20 rounded-full text-[var(--optibio-gold)] text-xs font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--optibio-navy)] mb-6 leading-tight">
              Redefining Wellness <br/> Through Science
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed font-medium">
              We started OptiBio with a simple mission: to bridge the gap between ancient wisdom and modern clinical research. No fillers, just results.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 -mt-12 relative z-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-[var(--color-border-card)] shadow-md bg-[var(--color-bg-card)]">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--optibio-navy)]/10 flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-[var(--optibio-navy)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--optibio-navy)]">Our Mission</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  To empower individuals with premium, research-backed supplements that support mental clarity, physical vitality, and overall well-being.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--color-border-card)] shadow-md bg-[var(--color-bg-card)]">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--optibio-navy)]/10 flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-[var(--optibio-navy)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--optibio-navy)]">Our Values</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  Transparency, quality, and scientific integrity guide everything we do. We never compromise on purity or potency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--color-border-card)] shadow-md bg-[var(--color-bg-card)]">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--optibio-navy)]/10 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-[var(--optibio-navy)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--optibio-navy)]">Our Promise</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  Every bottle is backed by our 90-day guarantee. If you don't feel the difference, we'll refund every penny—no questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-[var(--color-border-card)] shadow-xl">
              <CardContent className="p-12 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">The Optibio Story</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-ivory)]0 rounded-full" />
                </div>

                <div className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
                  <p>
                    Optibio was founded on a simple observation: in our fast-paced, high-stress world, people need reliable, science-backed solutions to support their mental and physical well-being. Too many supplement companies make bold claims without the research to back them up. We knew there had to be a better way.
                  </p>

                  <p>
                    Our journey began with extensive research into adaptogens—natural compounds that help the body adapt to stress. Among hundreds of options, one stood out: <strong>KSM-66® Ashwagandha</strong>, the most clinically studied ashwagandha extract in the world. With over 20 peer-reviewed studies demonstrating its effectiveness, we knew we had found something special.
                  </p>

                  <p>
                    But having the right ingredient was just the beginning. We partnered with GMP-certified manufacturers in the United States to ensure every batch meets the highest standards of purity and potency. Each bottle undergoes rigorous third-party testing for heavy metals, contaminants, and active compound concentration.
                  </p>

                  <p>
                    Today, Optibio serves thousands of customers who trust us to deliver premium supplements that actually work. We're not just selling products—we're building a community of individuals committed to optimizing their health naturally.
                  </p>

                  <p className="text-[var(--color-text-primary)] font-semibold italic">
                    "We believe that when you feel your best, you can achieve your best. That's the Optibio difference."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why KSM-66 */}
      <section className="py-16 bg-gradient-to-br from-[var(--optibio-ivory)] to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Why We Choose KSM-66®</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">
              Not all ashwagandha is created equal. Here's why we exclusively use KSM-66®:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-[var(--optibio-gold)]/30 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-ivory)] flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-[var(--optibio-navy)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Gold Standard Extract</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      KSM-66® is the highest concentration full-spectrum ashwagandha extract, preserving all bioactive compounds in their natural ratios for maximum effectiveness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--optibio-gold)]/30 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-ivory)] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-[var(--optibio-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-2">20+ Clinical Studies</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Backed by over 20 peer-reviewed studies demonstrating benefits for stress reduction, cognitive function, sleep quality, and physical performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--optibio-gold)]/30 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--optibio-navy)]/10 to-[var(--optibio-ivory)] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[var(--optibio-navy-dark)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Organic & Pure</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Certified organic, non-GMO, and free from chemical solvents. Extracted using a proprietary green chemistry process that uses only water and milk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--optibio-gold)]/30 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-ivory)] flex items-center justify-center">
                    <Award className="w-6 h-6 text-[var(--optibio-gold-dark)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Award-Winning Quality</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Winner of multiple industry awards for innovation and quality, including the Nutraingredients Award for Ingredient of the Year.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Our Quality Standards</h2>
              <p className="text-[var(--color-text-secondary)] text-lg">
                Every bottle meets the highest standards of purity, potency, and safety.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[var(--optibio-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">GMP Certified Facility</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Manufactured in FDA-registered, GMP-certified facilities in the USA with strict quality control protocols.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[var(--optibio-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Third-Party Tested</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Every batch is tested by independent laboratories for purity, potency, heavy metals, and contaminants.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[var(--optibio-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Non-GMO & Organic</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Made with certified organic KSM-66® ashwagandha, free from GMOs, gluten, and artificial additives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[var(--optibio-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Vegan & Clean</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      100% vegan capsules with no fillers, binders, or unnecessary ingredients. Just pure ashwagandha extract.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[var(--optibio-navy)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">5% Withanolides</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Standardized to contain 5% withanolides, the active compounds responsible for ashwagandha's benefits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[var(--optibio-navy)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Full-Spectrum Extract</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Made from root only (not leaves), preserving the complete profile of bioactive compounds found in nature.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[var(--optibio-navy)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Sustainable Sourcing</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Ethically sourced from certified organic farms in India using sustainable agricultural practices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--optibio-gold)]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[var(--optibio-navy)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Batch Tracking</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Every bottle has a unique batch number for complete traceability and quality assurance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-8 h-8 text-[var(--optibio-navy)]" />
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Meet Our Team</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] text-lg">
                A dedicated group of health professionals, researchers, and wellness advocates committed to your success.
              </p>
            </div>

            <Card className="border-2 border-[var(--color-border-card)] shadow-xl">
              <CardContent className="p-12 space-y-8">
                <div className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
                  <p>
                    Our team brings together decades of experience in nutrition science, herbal medicine, and supplement manufacturing. We're not just business people—we're health enthusiasts who personally use and believe in every product we create.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 py-6">
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-ivory)] flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-[var(--optibio-navy)]">R&D</span>
                      </div>
                      <h3 className="font-bold text-slate-900">Research Team</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        PhDs and nutritionists who evaluate every ingredient based on clinical evidence
                      </p>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-ivory)] flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-[var(--optibio-gold)]">QA</span>
                      </div>
                      <h3 className="font-bold text-slate-900">Quality Assurance</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Certified specialists ensuring every batch meets our rigorous standards
                      </p>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-ivory)] flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-[var(--optibio-gold-dark)]">CS</span>
                      </div>
                      <h3 className="font-bold text-slate-900">Customer Success</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Wellness coaches dedicated to supporting your health journey
                      </p>
                    </div>
                  </div>

                  <p>
                    We're passionate about transparency and education. Our customer success team includes certified wellness coaches who are available to answer your questions and help you get the most from your supplements.
                  </p>

                  <p className="text-[var(--color-text-primary)] font-semibold">
                    Every member of our team uses Optibio products daily. We wouldn't sell anything we wouldn't take ourselves.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="border-2 border-[var(--optibio-gold)]/30 shadow-2xl bg-gradient-to-br from-[var(--optibio-ivory)] to-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Ready to Experience the Optibio Difference?
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Join thousands of customers who trust Optibio for premium, science-backed supplements. Every purchase is backed by our 90-day money-back guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => setLocation("/shop")}
                  size="lg"
                  className="bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-navy)] hover:from-[var(--optibio-navy-dark)] hover:to-[var(--optibio-navy-dark)] shadow-lg text-lg px-8"
                >
                  Shop Now
                </Button>
                <Button
                  onClick={() => setLocation("/science")}
                  size="lg"
                  variant="outline"
                  className="border-2 text-lg px-8"
                >
                  View Clinical Studies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

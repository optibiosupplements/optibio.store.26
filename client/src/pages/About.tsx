import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Award, Leaf, Users, Target, Heart, CheckCircle2, Microscope } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-300/30 backdrop-blur-sm">
              <span className="text-blue-100 text-sm font-semibold">Our Story</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Redefining Wellness Through Science
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              At OptiBio, we believe that optimal health shouldn't be complicated. Our mission is to deliver premium, science-backed supplements that help you thrive in today's demanding world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 -mt-12 relative z-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  To empower individuals with premium, research-backed supplements that support mental clarity, physical vitality, and overall well-being.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Our Values</h3>
                <p className="text-slate-600 leading-relaxed">
                  Transparency, quality, and scientific integrity guide everything we do. We never compromise on purity or potency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Our Promise</h3>
                <p className="text-slate-600 leading-relaxed">
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
            <Card className="border-2 border-slate-200 shadow-xl">
              <CardContent className="p-12 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">The OptiBio Story</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full" />
                </div>

                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p>
                    OptiBio was founded on a simple observation: in our fast-paced, high-stress world, people need reliable, science-backed solutions to support their mental and physical well-being. Too many supplement companies make bold claims without the research to back them up. We knew there had to be a better way.
                  </p>

                  <p>
                    Our journey began with extensive research into adaptogens—natural compounds that help the body adapt to stress. Among hundreds of options, one stood out: <strong>KSM-66® Ashwagandha</strong>, the most clinically studied ashwagandha extract in the world. With over 20 peer-reviewed studies demonstrating its effectiveness, we knew we had found something special.
                  </p>

                  <p>
                    But having the right ingredient was just the beginning. We partnered with GMP-certified manufacturers in the United States to ensure every batch meets the highest standards of purity and potency. Each bottle undergoes rigorous third-party testing for heavy metals, contaminants, and active compound concentration.
                  </p>

                  <p>
                    Today, OptiBio serves thousands of customers who trust us to deliver premium supplements that actually work. We're not just selling products—we're building a community of individuals committed to optimizing their health naturally.
                  </p>

                  <p className="text-slate-900 font-semibold italic">
                    "We believe that when you feel your best, you can achieve your best. That's the OptiBio difference."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why KSM-66 */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why We Choose KSM-66®</h2>
            <p className="text-slate-600 text-lg">
              Not all ashwagandha is created equal. Here's why we exclusively use KSM-66®:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Gold Standard Extract</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      KSM-66® is the highest concentration full-spectrum ashwagandha extract, preserving all bioactive compounds in their natural ratios for maximum effectiveness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">20+ Clinical Studies</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Backed by over 20 peer-reviewed studies demonstrating benefits for stress reduction, cognitive function, sleep quality, and physical performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Organic & Pure</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Certified organic, non-GMO, and free from chemical solvents. Extracted using a proprietary green chemistry process that uses only water and milk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Award-Winning Quality</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Quality Standards</h2>
              <p className="text-slate-600 text-lg">
                Every bottle meets the highest standards of purity, potency, and safety.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">GMP Certified Facility</h3>
                    <p className="text-sm text-slate-600">
                      Manufactured in FDA-registered, GMP-certified facilities in the USA with strict quality control protocols.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Third-Party Tested</h3>
                    <p className="text-sm text-slate-600">
                      Every batch is tested by independent laboratories for purity, potency, heavy metals, and contaminants.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Non-GMO & Organic</h3>
                    <p className="text-sm text-slate-600">
                      Made with certified organic KSM-66® ashwagandha, free from GMOs, gluten, and artificial additives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Vegan & Clean</h3>
                    <p className="text-sm text-slate-600">
                      100% vegan capsules with no fillers, binders, or unnecessary ingredients. Just pure ashwagandha extract.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">5% Withanolides</h3>
                    <p className="text-sm text-slate-600">
                      Standardized to contain 5% withanolides, the active compounds responsible for ashwagandha's benefits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Full-Spectrum Extract</h3>
                    <p className="text-sm text-slate-600">
                      Made from root only (not leaves), preserving the complete profile of bioactive compounds found in nature.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Sustainable Sourcing</h3>
                    <p className="text-sm text-slate-600">
                      Ethically sourced from certified organic farms in India using sustainable agricultural practices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Batch Tracking</h3>
                    <p className="text-sm text-slate-600">
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
                <Users className="w-8 h-8 text-blue-700" />
                <h2 className="text-3xl font-bold text-slate-900">Meet Our Team</h2>
              </div>
              <p className="text-slate-600 text-lg">
                A dedicated group of health professionals, researchers, and wellness advocates committed to your success.
              </p>
            </div>

            <Card className="border-2 border-slate-200 shadow-xl">
              <CardContent className="p-12 space-y-8">
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p>
                    Our team brings together decades of experience in nutrition science, herbal medicine, and supplement manufacturing. We're not just business people—we're health enthusiasts who personally use and believe in every product we create.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 py-6">
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-blue-700">R&D</span>
                      </div>
                      <h3 className="font-bold text-slate-900">Research Team</h3>
                      <p className="text-sm text-slate-600">
                        PhDs and nutritionists who evaluate every ingredient based on clinical evidence
                      </p>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-green-700">QA</span>
                      </div>
                      <h3 className="font-bold text-slate-900">Quality Assurance</h3>
                      <p className="text-sm text-slate-600">
                        Certified specialists ensuring every batch meets our rigorous standards
                      </p>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-amber-700">CS</span>
                      </div>
                      <h3 className="font-bold text-slate-900">Customer Success</h3>
                      <p className="text-sm text-slate-600">
                        Wellness coaches dedicated to supporting your health journey
                      </p>
                    </div>
                  </div>

                  <p>
                    We're passionate about transparency and education. Our customer success team includes certified wellness coaches who are available to answer your questions and help you get the most from your supplements.
                  </p>

                  <p className="text-slate-900 font-semibold">
                    Every member of our team uses OptiBio products daily. We wouldn't sell anything we wouldn't take ourselves.
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
          <Card className="border-2 border-blue-200 shadow-2xl bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Ready to Experience the OptiBio Difference?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join thousands of customers who trust OptiBio for premium, science-backed supplements. Every purchase is backed by our 90-day money-back guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => setLocation("/shop")}
                  size="lg"
                  className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg text-lg px-8"
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

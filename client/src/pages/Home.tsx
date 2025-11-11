import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Moon, 
  Zap, 
  Heart, 
  CheckCircle2, 
  Star,
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
  Sparkles,
  Leaf
} from "lucide-react";
import { formatPrice } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();
  const mainProduct = products?.[0];

  const benefits = [
    {
      icon: Brain,
      title: "Mental Clarity & Focus",
      description: "44% reduction in stress markers. Clinically proven to support cognitive function and concentration.",
      stat: "44%"
    },
    {
      icon: Moon,
      title: "Restful Sleep Quality",
      description: "Significant improvements in sleep quality and duration backed by clinical research.",
      stat: "72%"
    },
    {
      icon: Zap,
      title: "Natural Energy Boost",
      description: "Supports sustained energy levels and physical performance without stimulants.",
      stat: "27.9%"
    },
    {
      icon: Heart,
      title: "Stress Resilience",
      description: "Helps your body adapt to stress naturally by supporting healthy cortisol levels.",
      stat: "20+"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Marketing Director",
      rating: 5,
      text: "I've tried many ashwagandha supplements, but OptiBio's KSM-66 is the only one that actually works. My stress levels are down and I'm sleeping better than ever!",
      verified: true
    },
    {
      name: "Michael R.",
      role: "Professional Athlete",
      rating: 5,
      text: "As an athlete, recovery is everything. This supplement has noticeably improved my endurance and recovery time. Highly recommend!",
      verified: true
    },
    {
      name: "Jennifer L.",
      role: "Healthcare Professional",
      rating: 5,
      text: "The quality is outstanding. Love that it's third-party tested and made in the USA. Finally a supplement brand I can trust!",
      verified: true
    }
  ];

  const certifications = [
    { icon: Shield, text: "Third-Party Tested", desc: "Every batch verified" },
    { icon: Award, text: "GMP Certified", desc: "Pharmaceutical-grade facility" },
    { icon: CheckCircle2, text: "Non-GMO & Organic", desc: "Clean ingredients only" },
    { icon: TrendingUp, text: "20+ Clinical Studies", desc: "Science-backed efficacy" }
  ];

  const whyKSM66 = [
    {
      title: "Root-Only Extract",
      description: "Made exclusively from ashwagandha roots using proprietary extraction—no leaves or inferior parts."
    },
    {
      title: "Full-Spectrum Formula",
      description: "Preserves the complete balance of bioactive withanolides found in the whole herb."
    },
    {
      title: "Clinical Dosage",
      description: "600mg per capsule—the exact dose used in peer-reviewed research studies."
    },
    {
      title: "Gold Standard Quality",
      description: "Most clinically studied ashwagandha on the market with proven results."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Modern & Sophisticated */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Copy */}
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-6">
                <Badge 
                  variant="secondary" 
                  className="text-sm font-semibold px-4 py-1.5 bg-gradient-to-r from-blue-600/10 to-amber-600/10 border-blue-200/50"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                  Clinically Researched KSM-66®
                </Badge>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Premium{" "}
                  <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-amber-600 bg-clip-text text-transparent">
                    Ashwagandha
                  </span>
                  <br />
                  for Stress-Free Living
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-xl">
                  Backed by 20+ peer-reviewed studies. The gold standard in ashwagandha supplementation for stress management, mental clarity, and overall wellness.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm">
                {certifications.slice(0, 3).map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <cert.icon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{cert.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/science">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 border-2 hover:bg-slate-50"
                  >
                    View Clinical Studies
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-amber-400 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-900">5,000+</span> satisfied customers
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Product Image */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-amber-100/40 rounded-full blur-3xl scale-75" />
              
              {/* Product image */}
              <div className="relative z-10 animate-float">
                <img 
                  src="/products/optibio-90cap-bottle-front.jpg" 
                  alt="OptiBio Ashwagandha KSM-66 - 90 Capsules"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>

              {/* Floating badge - 90 Capsules */}
              <div className="absolute top-10 right-10 bg-white rounded-2xl shadow-xl p-4 animate-fade-in-delay">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    90
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Capsules</div>
                </div>
              </div>

              {/* Floating badge - Clinical Studies */}
              <div className="absolute bottom-10 left-10 bg-white rounded-2xl shadow-xl p-4 animate-fade-in-delay-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">20+ Studies</div>
                    <div className="text-xs text-slate-600">Clinically Proven</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientifically-Backed Benefits */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              <Leaf className="w-3.5 h-3.5 mr-1.5" />
              Clinically Validated
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Scientifically-Backed Benefits
            </h2>
            <p className="text-xl text-slate-600">
              KSM-66 is the most clinically studied ashwagandha extract, with research demonstrating significant benefits across multiple health markers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <Card 
                key={i} 
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/10 to-amber-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-7 h-7 text-blue-700" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    {benefit.stat}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why KSM-66 Specifically */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative">
              <img 
                src="/products/optibio-90cap-bottle-angle.jpg" 
                alt="OptiBio Ashwagandha KSM-66 Premium Quality"
                className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl"
              />
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
                  Premium Quality
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Why KSM-66® Specifically?
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Not all ashwagandha is created equal. KSM-66 represents the pinnacle of ashwagandha supplementation—here's why it matters.
                </p>
              </div>

              <div className="space-y-6">
                {whyKSM66.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-amber-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/science">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 hover:bg-white"
                >
                  Read the Science
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      {mainProduct && (
        <section className="py-24 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden border-2 shadow-2xl">
                <div className="grid md:grid-cols-2">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-12 flex items-center justify-center">
                    <img 
                      src={mainProduct.imageUrl || "/products/optibio-90cap-bottle-front.jpg"}
                      alt={mainProduct.name}
                      className="w-full max-w-xs drop-shadow-2xl"
                    />
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-amber-600">
                        Best Seller
                      </Badge>
                      <h3 className="text-3xl font-bold text-slate-900">
                        {mainProduct.name}
                      </h3>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        Premium full-spectrum Ashwagandha root extract standardized to 5% withanolides. Clinically studied KSM-66® formula for stress management, mental clarity, and overall wellness.
                      </p>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <div className="text-4xl font-bold text-slate-900">
                        {formatPrice(mainProduct.priceInCents)}
                      </div>
                      {mainProduct.compareAtPriceInCents && (
                        <div className="text-xl text-slate-400 line-through">
                          {formatPrice(mainProduct.compareAtPriceInCents)}
                        </div>
                      )}
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Save 25%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span>90 capsules - 3-month supply</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span>600mg clinical dose per capsule</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span>60-day money-back guarantee</span>
                      </div>
                    </div>

                    <Link href="/shop">
                      <Button 
                        size="lg" 
                        className="w-full text-lg py-6 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100">
              See what our customers are saying about their OptiBio experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-blue-200">{testimonial.role}</div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Certifications */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Quality You Can Trust
            </h2>
            <p className="text-xl text-slate-600">
              Every bottle meets the highest standards of purity, potency, and safety
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, i) => (
              <div 
                key={i} 
                className="text-center space-y-4 p-8 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/10 to-amber-600/10 flex items-center justify-center mx-auto">
                  <cert.icon className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {cert.text}
                </h3>
                <p className="text-slate-600">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-700 via-blue-600 to-amber-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Wellness?
            </h2>
            <p className="text-xl text-blue-50">
              Join thousands who have discovered the power of premium KSM-66 Ashwagandha
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 py-6 bg-white text-blue-700 hover:bg-blue-50 shadow-xl"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-blue-100">
              Free shipping on orders over $75 • 60-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
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
import WellnessPlanPersonalizer from "@/components/WellnessPlanPersonalizer";

import { SocialProofCounter } from "@/components/SocialProofCounter";
import CountdownTimer from "@/components/CountdownTimer";
import StickyAddToCart from "@/components/StickyAddToCart";

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();
  const mainProduct = products?.[0];
  // Removed reservation modal - now using direct purchase

  const benefits = [
    {
      icon: Brain,
      title: "Wake Up Calm, Not Anxious",
      description: "Start your day feeling grounded instead of overwhelmed. You'll just notice you're not snapping at your partner or dreading your inbox. (44% reduction in stress markers in clinical studies)",
      stat: "44%"
    },
    {
      icon: Moon,
      title: "Finally, Sleep That Actually Restores",
      description: "Remember what it's like to wake up refreshed? Fall asleep faster, stay asleep longer, and wake up ready for the day. (72% improvement in sleep quality in clinical research)",
      stat: "72%"
    },
    {
      icon: Zap,
      title: "Energy Without the Crash",
      description: "No more 3pm slumps or reaching for your fourth coffee. Sustainable energy that lasts all day, powered by your body—not caffeine. (27.9% improvement in physical performance)",
      stat: "27.9%"
    },
    {
      icon: Heart,
      title: "Handle Life's Chaos with Calm",
      description: "Deadlines, traffic, family demands—they don't disappear. But you'll feel more equipped to handle them without feeling constantly on edge. (Clinically proven to support healthy stress response)",
      stat: "20+"
    }
  ];

  const testimonials = [
    {
      name: "Rachel K.",
      role: "Elementary Teacher & Mom, Austin TX",
      rating: 5,
      text: "I used to dread Mondays. I'm a teacher with two kids under 5, and by Wednesday I was running on fumes. Since starting Optibio, I actually have energy for bedtime stories. My husband noticed I'm not as snappy. Small changes, huge impact.",
      verified: true
    },
    {
      name: "David L.",
      role: "Software Engineer, San Francisco",
      rating: 5,
      text: "I was skeptical about adaptogens—tried three other brands that did nothing. But after two weeks with Optibio, I noticed I wasn't doom-scrolling at 2am anymore. My sleep tracker confirms it: I'm getting 90 more minutes of deep sleep per night.",
      verified: true
    },
    {
      name: "Maya P.",
      role: "Grad Student & Research Assistant",
      rating: 5,
      text: "Thesis deadlines had me living on coffee and anxiety. A friend recommended Optibio and I figured, why not? Three weeks in, I can actually focus for more than 20 minutes. My advisor asked what changed. This stuff is legit.",
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
      description: "300mg per capsule—take 2 capsules daily for the 600mg clinical dose used in peer-reviewed research studies."
    },
    {
      title: "Gold Standard Quality",
      description: "Most clinically studied ashwagandha on the market with proven results."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - The Future of Wellness */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #E8F2F8 0%, #C8DFF0 40%, #7A9BB5 100%)' }}>
        {/* Clean background - no visual noise */}
        
        <div className="container relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Left Column - Copy - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-10 animate-fade-in order-2 lg:order-1">
              <div className="space-y-6">
                <Badge 
                  className="text-base md:text-lg font-bold px-6 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#152B45] text-white border-0 shadow-lg"
                >
                  <Shield className="w-5 h-5 mr-2 inline" />
                  Science-Backed • Third-Party Tested
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] text-[#2D2D2D]">
                  Feel Like{" "}
                  <span className="text-gradient-optibio">
                    Yourself
                  </span>
                  {" "}Again
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-[#1E3A5F] leading-relaxed max-w-2xl">
                  Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply.
                </p>
              </div>

              {/* Trust Indicators - Mobile Optimized */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-base">
                {certifications.slice(0, 3).map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 text-[#1E3A5F]">
                    <cert.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A961]" />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#2D2D2D] text-base">{cert.text}</span>
                      <span className="text-sm text-[#1E3A5F]">Verified</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing & Urgency - Mobile Optimized */}
              <div className="bg-gradient-to-br from-white/90 to-[#F7F4EF]/90 backdrop-blur-sm border-2 border-[#C9A961]/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                {/* Countdown Timer - P0 FIX: Add urgency above fold */}
                <CountdownTimer 
                  targetDate={new Date('2026-01-20T23:59:59')} 
                  className="mb-4"
                />
                
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">{mainProduct ? formatPrice(mainProduct.priceInCents) : '$37.49'}</span>
                  <span className="text-xl sm:text-2xl text-slate-500 line-through">{mainProduct?.compareAtPriceInCents ? formatPrice(mainProduct.compareAtPriceInCents) : '$69.99'}</span>
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-sm font-bold px-3 py-1.5 shadow-md">
                    Save 46%
                  </Badge>
                </div>
                <p className="text-sm text-[#1E3A5F] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A961]" />
                  <span className="font-semibold">Pre-Order Special:</span> Ships Jan 20-27, 2026
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                  <span className="animate-pulse text-amber-600">⏱️</span>
                  <span className="font-semibold">Free shipping</span> on orders $75+
                </div>
                
                {/* P0 FIX: CTA moved inside pricing card, closer to price */}
                <Link href="/product/ashwagandha-ksm-66" className="block">
                  <Button 
                    size="lg" 
                    className="w-full text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 min-h-[56px] md:min-h-[64px] bg-gradient-to-r from-[#1E3A5F] to-[#152B45] hover:from-[#152B45] hover:to-[#0F1F30] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    Pre-Order Now - Save 46%
                    <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </Link>
                {/* Anxiety-reducing micro-copy */}
                <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>Free shipping on $75+</span>
                  <span className="text-slate-300">•</span>
                  <span>90-day guarantee</span>
                </p>
              </div>

              {/* P0 FIX: Removed duplicate CTA, moved to pricing card above */}

              {/* Social Proof - Enhanced */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#152B45] border-3 border-white shadow-lg" />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-[#C9A961] text-[#C9A961]" />
                      ))}
                      <span className="ml-2 text-sm font-bold text-slate-900">4.9/5</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900 text-lg">5,247</span> happy customers
                    </p>
                    <p className="text-xs text-green-700 font-semibold mt-1">
                      ✅ <span className="font-bold">127</span> bottles sold in last 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Image - Mobile Optimized */}
            <div className="relative h-[450px] sm:h-[500px] lg:h-[700px] flex items-center justify-center order-1 lg:order-2">
              {/* Product image - Let it breathe with clean whitespace */}
              <div className="relative animate-float">
                <img 
                  src="/products/optibio-90cap-bottle-front.jpg" 
                  alt="Optibio Ashwagandha KSM-66 supplement bottle - 90 capsules, 300mg per capsule, premium black glass bottle with gold cap"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientifically-Backed Benefits */}
      <section className="py-24 bg-gradient-to-br from-[#F7F4EF] to-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30">
              <Leaf className="w-3.5 h-3.5 mr-1.5" />
              Clinically Validated
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Scientifically-Backed Benefits
            </h2>
            <p className="text-xl text-slate-600">
              KSM-66 is the most clinically studied ashwagandha extract, with research demonstrating significant benefits across multiple health markers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => {
              const lifestyleImages = [
                '/images/lifestyle-morning-routine.jpg',
                '/images/lifestyle-evening-relaxation.jpg',
                '/images/lifestyle-focused-work.jpg',
                '/images/lifestyle-active-wellness.jpg'
              ];
              return (
                <Card 
                  key={i} 
                  className="group hover:shadow-2xl transition-all duration-300 border-2 border-[#C9A961]/20 hover:border-[#C9A961]/40 cursor-pointer overflow-hidden border-t-4 border-t-[#C9A961]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={lifestyleImages[i]} 
                      alt={`${benefit.title} - ${benefit.description.split('.')[0]}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/80 via-[#1E3A5F]/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-4xl font-bold text-[#C9A961] mb-2">
                        {benefit.stat}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {benefit.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-gradient-to-br from-[#F7F4EF]/80 to-[#EDE9E3]/80">
                    <p className="text-slate-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 90-Day Money-Back Guarantee - PROMINENT */}
      <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#152B45] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C9A961] to-[#B89651] flex items-center justify-center shadow-2xl">
                <Shield className="w-12 h-12 text-[#1E3A5F]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                90-Day Money-Back Guarantee
              </h2>
              <p className="text-xl text-[#F7F4EF]/90 leading-relaxed max-w-2xl mx-auto">
                We're so confident you'll feel the difference that we offer a <strong className="text-[#C9A961]">full 90-day guarantee</strong>. That's 12 weeks to try Optibio risk-free.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-2 border-[#C9A961]/40 rounded-2xl p-8 md:p-12 mb-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#C9A961] mb-2">1</div>
                  <h3 className="text-lg font-bold text-white mb-2">Try It</h3>
                  <p className="text-[#F7F4EF]/80 text-sm">Take Optibio daily for up to 90 days</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#C9A961] mb-2">2</div>
                  <h3 className="text-lg font-bold text-white mb-2">Feel the Difference</h3>
                  <p className="text-[#F7F4EF]/80 text-sm">Notice calmer mornings, better sleep, clearer thinking</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#C9A961] mb-2">3</div>
                  <h3 className="text-lg font-bold text-white mb-2">Keep or Return</h3>
                  <p className="text-[#F7F4EF]/80 text-sm">Not satisfied? Full refund. No questions asked.</p>
                </div>
              </div>

              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <p className="text-[#F7F4EF] text-lg"><strong className="text-white">Full refund</strong> — Every penny back, no hassle</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <p className="text-[#F7F4EF] text-lg"><strong className="text-white">No questions asked</strong> — We trust your judgment</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <p className="text-[#F7F4EF] text-lg"><strong className="text-white">Keep the bottle</strong> — It's yours, even if you return it</p>
                </div>
              </div>
            </div>

            <p className="text-[#F7F4EF]/70 text-sm max-w-2xl mx-auto mb-8">
              Why 90 days? Because adaptogens like ashwagandha work with your body over time. Most people feel changes within 2-4 weeks, but we want you to experience the full benefits before deciding.
            </p>

            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#C9A961] text-[#1E3A5F] font-bold text-lg px-12 py-8 shadow-2xl hover:shadow-[0_0_40px_rgba(201,169,97,0.4)] transition-all duration-300">
                Try Optibio Risk-Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why KSM-66 Specifically */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-[#F7F4EF]/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative">
              <img 
                src="/products/optibio-90cap-bottle-angle.jpg" 
                alt="Optibio Ashwagandha KSM-66 premium supplement - angled view of black glass bottle with gold cap showing product label and branding"
                className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl"
              />
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30">
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#C9A961] flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
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

      {/* How It Works - Timeline */}
      <section className="py-24 bg-gradient-to-br from-[#1E3A5F] to-[#152B45] text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-[#C9A961]/20 text-[#C9A961] border-[#C9A961]/30">
              Your Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What to Expect Week by Week
            </h2>
            <p className="text-xl text-[#F7F4EF]">
              Real results take time. Here's what thousands of customers experience as their bodies adapt to KSM-66®.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Week 1-2 */}
            <div className="relative pl-8 md:pl-16 pb-12 border-l-4 border-[#C9A961]/30">
              <div className="absolute left-0 -ml-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A961] to-[#B89651] border-4 border-[#1E3A5F]" />
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#C9A961]">Week 1-2: Settling In</h3>
                  <Badge className="bg-[#C9A961]/20 text-[#C9A961] border-[#C9A961]/30 w-fit mt-2 md:mt-0">
                    Early Days
                  </Badge>
                </div>
                <p className="text-lg text-[#F7F4EF] leading-relaxed">
                  Your body is adjusting. You might notice subtle changes in how you respond to stress—maybe you don't snap as quickly, or your mind feels a bit quieter. Some people feel nothing yet, and that's completely normal. Keep going.
                </p>
              </div>
            </div>

            {/* Week 2-4 */}
            <div className="relative pl-8 md:pl-16 pb-12 border-l-4 border-[#C9A961]/30">
              <div className="absolute left-0 -ml-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A961] to-[#B89651] border-4 border-[#1E3A5F]" />
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#C9A961]">Week 2-4: Sleep Improves</h3>
                  <Badge className="bg-[#C9A961]/20 text-[#C9A961] border-[#C9A961]/30 w-fit mt-2 md:mt-0">
                    First Benefits
                  </Badge>
                </div>
                <p className="text-lg text-[#F7F4EF] leading-relaxed mb-4">
                  This is when most people notice they're falling asleep faster and waking up more refreshed. You might catch yourself thinking, "Huh, I actually slept through the night." Stress feels more manageable—not gone, but less overwhelming.
                </p>
                <div className="flex items-center gap-2 text-[#C9A961]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">72% of users report better sleep quality by week 3</span>
                </div>
              </div>
            </div>

            {/* Week 4-8 */}
            <div className="relative pl-8 md:pl-16 pb-12 border-l-4 border-[#C9A961]/30">
              <div className="absolute left-0 -ml-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A961] to-[#B89651] border-4 border-[#1E3A5F]" />
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#C9A961]">Week 4-8: Sustained Benefits</h3>
                  <Badge className="bg-[#C9A961]/20 text-[#C9A961] border-[#C9A961]/30 w-fit mt-2 md:mt-0">
                    Peak Results
                  </Badge>
                </div>
                <p className="text-lg text-[#F7F4EF] leading-relaxed mb-4">
                  The magic window. Energy feels more consistent throughout the day. You're handling work stress without that constant edge of anxiety. Friends might ask, "What changed?" This is when the clinical benefits really show up.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#C9A961]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">44% reduction in stress markers</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#C9A961]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">27.9% improvement in physical performance</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#C9A961]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Noticeable improvement in focus and mental clarity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Week 8+ */}
            <div className="relative pl-8 md:pl-16">
              <div className="absolute left-0 -ml-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A961] to-[#B89651] border-4 border-[#1E3A5F]" />
              <div className="bg-gradient-to-br from-[#C9A961]/20 to-[#B89651]/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#C9A961]/40">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#C9A961]">Week 8+: Your New Normal</h3>
                  <Badge className="bg-[#C9A961] text-[#1E3A5F] border-0 w-fit mt-2 md:mt-0">
                    Optimal
                  </Badge>
                </div>
                <p className="text-lg text-[#F7F4EF] leading-relaxed">
                  You've adapted. Stress still happens—life doesn't stop—but you're responding differently. You're sleeping well, thinking clearly, and feeling more like yourself. This is what "wellness" actually feels like: not perfect, just better equipped.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-[#F7F4EF]/80 text-lg">
              💡 <strong>Remember:</strong> Everyone's timeline is different. Some feel changes in days, others in weeks. Consistency is what matters.
            </p>
          </div>
        </div>
      </section>

      {/* Wellness Plan Personalizer */}
      <WellnessPlanPersonalizer />

      {/* Who This Is For - Qualification Section */}
      <section className="py-24 bg-gradient-to-br from-[#F7F4EF] to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30">
                Is This Right for You?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                Who This Is For (And Who It's Not)
              </h2>
              <p className="text-xl text-slate-600">
                Optibio works best for people dealing with specific challenges. Here's how to know if it's right for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* This IS for you */}
              <Card className="border-2 border-[#C9A961]/30 bg-gradient-to-br frobg-[#F7F4EF]50 to-white">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C9A961]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-[#C9A961]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">This IS for you if:</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-1" />
                      <p className="text-slate-700">You're dealing with <strong>chronic stress</strong> from work, family, or life transitions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-1" />
                      <p className="text-slate-700">You struggle with <strong>racing thoughts</strong> or difficulty falling asleep</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-1" />
                      <p className="text-slate-700">You feel <strong>mentally foggy</strong> or can't focus like you used to</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-1" />
                      <p className="text-slate-700">You're <strong>exhausted but wired</strong>—tired all day, restless at night</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-1" />
                      <p className="text-slate-700">You want a <strong>science-backed solution</strong>, not just "wellness hype"</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-1" />
                      <p className="text-slate-700">You're willing to <strong>commit to 8-12 weeks</strong> for real results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* This is NOT for you */}
              <Card className="border-2 border-[#C9A961]/20 bg-gradient-to-br from-[#F7F4EF]/50 to-white">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-600">✕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">This is NOT for you if:</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600">You're looking for <strong>instant energy</strong> or a caffeine replacement</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600">You want <strong>overnight results</strong> (adaptogens take time to work)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600">You're not willing to <strong>take it consistently</strong> for at least a month</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600">You're pregnant, nursing, or have a <strong>thyroid condition</strong> (consult your doctor first)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600">You prefer <strong>cheap supplements</strong> over premium, tested quality</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600">You're looking for a <strong>magic pill</strong> instead of a wellness tool</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-[#F7F4EF] border-2 border-[#C9A961]/30 rounded-2xl p-8 max-w-2xl mx-auto">
                <p className="text-lg text-slate-700 leading-relaxed">
                  <strong className="text-[#1E3A5F]">Still not sure?</strong> That's okay. We offer a <strong className="text-[#1E3A5F]">90-day money-back guarantee</strong>. Try it for 12 weeks. If you don't feel calmer, more focused, and better rested, we'll refund every penny. No questions asked.
                </p>
                <Link href="/shop">
                  <Button size="lg" className="mt-6 bg-gradient-to-r from-[#1E3A5F] to-[#152B45] hover:from-[#152B45] hover:to-[#1E3A5F]">
                    Try Optibio Risk-Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Add-to-Cart Bar */}
      {mainProduct && (
        <StickyAddToCart
          productId={mainProduct.id}
          productName={mainProduct.name}
          price={mainProduct.priceInCents / 100}
          image={mainProduct.imageUrl || "/products/optibio-90cap-bottle-front.jpg"}
          threshold={600}
        />
      )}

      {/* Featured Product */}
      {mainProduct && (
        <section className="py-24 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden border-2 shadow-2xl">
                <div className="grid md:grid-cols-2">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-[#F7F4EF] to-[#EDE9E3] p-12 flex items-center justify-center">
                    <img 
                      src={mainProduct.imageUrl || "/products/optibio-90cap-bottle-front.jpg"}
                      alt={`${mainProduct.name} - Premium KSM-66 Ashwagandha supplement for stress relief, sleep support, and natural energy`}
                      className="w-full max-w-xs drop-shadow-2xl"
                    />
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                      <Badge className="bg-gradient-to-r from-[#1E3A5F] to-[#C9A961]">
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
                      <Badge variant="secondary" className="bg-[#C9A961]/20 text-[#1E3A5F]">
                        Save 25%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A961]" />
                        <span>90 capsules - 45-day supply</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A961]" />
                        <span>300mg per capsule (600mg clinical dose with 2 capsules)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A961]" />
                        <span>60-day money-back guarantee</span>
                      </div>
                    </div>

                    <Link href="/shop">
                      <Button 
                        size="lg" 
                        className="w-full text-lg py-6 bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#C9A961] text-[#1E3A5F] font-bold shadow-glow-gold hover:shadow-glow-gold transition-all duration-300"
                      >
                        Pre-Order Now - Save 46%
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
      <section className="py-24 bg-gradient-to-br from-[#1E3A5F] to-[#152B45] text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-[#F7F4EF]">
              See what our customers are saying about their Optibio experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-white/15 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-1 text-[#C9A961]">
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
                      <div className="text-sm text-[#F7F4EF]/80">{testimonial.role}</div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="bg-[#C9A961]/20 text-[#C9A961] border-[#C9A961]/30">
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A5F]/10 to-[#C9A961]/10 flex items-center justify-center mx-auto">
                  <cert.icon className="w-8 h-8 text-[#1E3A5F]" />
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
      <section className="py-24 bg-gradient-to-br from-[#1E3A5F] via-[#152B45] to-[#C9A961] text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Try Optibio Risk-Free for 90 Days
            </h2>
            <p className="text-xl text-[#F7F4EF] leading-relaxed">
              Take Optibio for 90 days. If you don't feel calmer, more focused, and better rested, we'll refund every penny. No questions asked. No return shipping. You can even keep the bottle.
            </p>
            <p className="text-lg text-[#F7F4EF] font-medium">
              Why? Because we've seen the research. We know it works. And we want you to experience it risk-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#C9A961] text-[#1E3A5F] font-bold shadow-glow-gold"
                >
                  Shop Now - Save 29%
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-[#F7F4EF]">
              Free shipping on orders over $75 • 90-day money-back guarantee • Trusted by 5,000+ customers
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-24 bg-gradient-to-br from-[#1E3A5F] via-[#152B45] to-[#1E3A5F] text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div>
              <Badge className="bg-[#C9A961] text-[#1E3A5F] font-bold text-lg px-6 py-2 mb-4">
                LIMITED TIME OFFER
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Save 29% on Your First Order
              </h2>
              <p className="text-xl text-[#F7F4EF] max-w-2xl mx-auto mb-6">
                Premium KSM-66 Ashwagandha at an unbeatable price. Free shipping on orders over $75.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Single Bottle - Entry Option */}
              <Card className="bg-white/10 backdrop-blur-sm border-[#C9A961]/40 hover:border-[#C9A961]/70 transition-all relative">
                <CardContent className="p-8">
                  <Zap className="w-10 h-10 text-[#C9A961] mb-4" />
                  <h3 className="font-bold text-2xl mb-3">Single Bottle</h3>
                  <div className="mb-4">
                    <p className="text-4xl font-bold mb-2">$49.99</p>
                    <p className="text-lg text-[#F7F4EF]">90 capsules • 45-day supply</p>
                    <p className="text-sm text-[#C9A961] mt-2">Save 15% vs retail ($58.82)</p>
                  </div>
                  <ul className="space-y-2 mb-6 text-[#F7F4EF]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span>Perfect for first-time buyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span>Free shipping on orders $75+</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span>90-day money-back guarantee</span>
                    </li>
                  </ul>
                  <Link href="/shop" className="block">
                    <Button className="w-full bg-[#C9A961] hover:bg-[#B89651] text-[#1E3A5F] font-bold text-lg py-6">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 3-Month Bundle - Most Popular */}
              <Card className="bg-white/10 backdrop-blur-sm border-3 border-[#C9A961] shadow-glow-gold hover:shadow-glow-gold-lg transition-all relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[#C9A961] to-[#B89651] text-[#1E3A5F] font-bold text-sm px-6 py-1.5 shadow-lg">
                    ⭐ MOST POPULAR
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <Star className="w-10 h-10 text-[#C9A961] mb-4" />
                  <h3 className="font-bold text-2xl mb-3">3-Month Bundle</h3>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold">$127</p>
                      <p className="text-xl text-[#F7F4EF]/60 line-through">$149.97</p>
                    </div>
                    <p className="text-lg text-[#F7F4EF] mt-1">270 capsules • 135-day supply</p>
                    <p className="text-sm text-[#C9A961] mt-2 font-bold">Save $22.97 (15% off) + FREE shipping</p>
                  </div>
                  <ul className="space-y-2 mb-6 text-[#F7F4EF]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Best value - $42.33/bottle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span>FREE shipping (save $7.99)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span>Full 90-day trial period covered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                      <span>See results through week 8+ optimal phase</span>
                    </li>
                  </ul>
                  <Link href="/shop" className="block">
                    <Button className="w-full bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#C9A961] text-[#1E3A5F] font-bold text-lg py-6 shadow-lg">
                      Get Best Value
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Link href="/shop">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#C9A961] text-[#1E3A5F] font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-glow-gold transition-all"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Shop Now - Save 29%
              </Button>
            </Link>

            <p className="text-sm text-[#F7F4EF]">
              Free shipping • 90-day money-back guarantee • Secure checkout
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

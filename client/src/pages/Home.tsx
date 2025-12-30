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
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTheme } from "@/contexts/ThemeContext";
import BuyBoxV3 from "@/components/BuyBoxV3";

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();
  const mainProduct = products?.[0];
  const { theme } = useTheme();
  
  // Theme-aware product image selection
  const isDark = theme === 'dark';
  const heroProductImage = '/bottlemockbluegold_beigebg.png';
  
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
      {/* Hero Section - Single Column Centered Layout per Reference */}
      <section 
        className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)'
        }}
      >
        <div className="container relative z-10">
          {/* Top: Headline Section (Centered) */}
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-12 animate-fade-in">
            <Badge 
              className="text-sm sm:text-base font-bold px-4 sm:px-6 py-2 sm:py-3 border-0 shadow-lg inline-flex items-center"
              style={{ background: '#1E3A5F', color: 'white' }}
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Science-Backed • Third-Party Tested
            </Badge>
            
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]"
              style={{ color: '#1E3A5F' }}
            >
              Feel Like{" "}
              <span className="text-gradient-optibio">
                Yourself
              </span>
              {" "}Again
            </h1>
            
            <p 
              className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-semibold"
              style={{ color: '#1E3A5F' }}
            >
              Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center pt-4">
              {certifications.slice(0, 3).map((cert, i) => (
                <div key={i} className="flex items-center gap-2 scroll-fade-in">
                  <cert.icon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#C9A961' }} />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base" style={{ color: '#1E3A5F' }}>{cert.text}</span>
                    <span className="text-xs sm:text-sm" style={{ color: '#1E3A5F' }}>Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Integrated Product Card */}
          <div className="max-w-6xl mx-auto animate-fade-in">
            <BuyBoxV3 product={mainProduct} />
          </div>
        </div>
      </section>

      {/* Scientifically-Backed Benefits */}
      <section className="py-24 bg-white dark:bg-[#0B1120] transition-colors duration-500">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-[#C9A961]/10 text-[#1E3A5F] dark:text-[#D4AF37] border-[#C9A961]/30">
              <Leaf className="w-3.5 h-3.5 mr-1.5" />
              Clinically Validated
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E3A5F] dark:text-white">
              Scientifically-Backed Benefits
            </h2>
            <p className="text-xl text-muted-foreground dark:text-[#94A3B8]">
              KSM-66 is the most clinically studied ashwagandha extract, with research demonstrating significant benefits across multiple health markers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => {
              const lifestyleImages = [
                '/lifestyle-workspace.png',
                '/lifestyle-bedside.png',
                '/lifestyle-morning-routine.png',
                '/lifestyle-workspace.png'
              ];
              return (
                <Card 
                  key={i} 
                  className="group hover:shadow-2xl transition-all duration-300 border-2 border-[#C9A961]/20 hover:border-[#C9A961]/40 dark:bg-[#1E3A5F] dark:border-[#2D4A77] cursor-pointer overflow-hidden border-t-4 border-t-[#C9A961] scroll-fade-in"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={lifestyleImages[i]} 
                      alt={`${benefit.title} - ${benefit.description.split('.')[0]}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6 px-2">
                      <div className="text-4xl font-bold text-[#C9A961] dark:text-[#D4AF37] mb-2 drop-shadow-lg">
                        {benefit.stat}
                      </div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {benefit.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white dark:bg-[#1E3A5F] shadow-md">
                    <p className="text-slate-700 dark:text-[#94A3B8] leading-relaxed">
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
      <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#152B45] dark:from-[#24426A] dark:to-[#1E3A5F] border-y border-[#C9A961]/20 dark:border-[#D4AF37]/30 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C9A961] to-[#B89651] dark:from-[#D4AF37] dark:to-[#C9A961] flex items-center justify-center shadow-2xl">
                <Shield className="w-12 h-12 text-[#1E3A5F] dark:text-[#0B1120]" />
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
                  <div className="text-6xl font-extrabold text-[#C9A961] dark:text-[#D4AF37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{WebkitTextStroke: '3px currentColor', paintOrder: 'stroke fill'}}>1</div>
                  <h3 className="text-lg font-bold text-white mb-2">Try It</h3>
                  <p className="text-[#F7F4EF]/80 text-sm">Take Optibio daily for up to 90 days</p>
                </div>
                <div className="text-center relative">
                  {/* Connecting line - left - thicker for visibility */}
                  <div className="hidden md:block absolute left-0 top-8 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent" />
                  <div className="text-6xl font-extrabold text-[#C9A961] dark:text-[#D4AF37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] relative z-10" style={{WebkitTextStroke: '3px currentColor', paintOrder: 'stroke fill'}}>2</div>
                  <h3 className="text-lg font-bold text-white mb-2">Feel the Difference</h3>
                  <p className="text-[#F7F4EF]/80 text-sm">Notice calmer mornings, better sleep, clearer thinking</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-extrabold text-[#C9A961] dark:text-[#D4AF37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{WebkitTextStroke: '3px currentColor', paintOrder: 'stroke fill'}}>3</div>
                  <h3 className="text-lg font-bold text-white mb-2">Keep or Return</h3>
                  <p className="text-[#F7F4EF]/80 text-sm">Not satisfied? Full refund. No questions asked.</p>
                </div>
              </div>

              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#C9A961] dark:text-[#D4AF37] flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" strokeWidth={3} />
                  <p className="text-[#F7F4EF] text-lg"><strong className="text-white">Full refund</strong> — Every penny back, no hassle</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#C9A961] dark:text-[#D4AF37] flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" strokeWidth={3} />
                  <p className="text-[#F7F4EF] text-lg"><strong className="text-white">No questions asked</strong> — We trust your judgment</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#C9A961] dark:text-[#D4AF37] flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" strokeWidth={3} />
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
      <section className="py-24 bg-white dark:bg-[#0B1120] transition-colors duration-500">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image with glow effect (no white box in dark mode) */}
            <div className="relative">
              {/* Subtle gold glow behind bottle - ALWAYS visible for luxury aesthetic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[60%] h-[70%] bg-gradient-radial from-[#C9A961]/20 via-[#C9A961]/8 to-transparent blur-3xl dark:from-[#D4AF37]/15 dark:via-[#D4AF37]/5" />
              </div>
              <img 
                src="/bottlemockbluegold_beigebg.png" 
                alt="Optibio Ashwagandha KSM-66 premium supplement - angled view of black glass bottle with gold cap showing product label and branding"
                className="w-full max-w-lg mx-auto relative z-10"
                style={{ filter: 'drop-shadow(0 0 15px rgba(201, 169, 97, 0.3))' }}
              />
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-[#C9A961]/10 text-[#1E3A5F] dark:text-[#D4AF37] border-[#C9A961]/30">
                  Premium Quality
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold dark:text-white">
                  Why KSM-66® Specifically?
                </h2>
                <p className="text-xl text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Not all ashwagandha is created equal. KSM-66 represents the pinnacle of ashwagandha supplementation—here's why it matters.
                </p>
              </div>

              <div className="space-y-6">
                {whyKSM66.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#C9A961] dark:from-[#D4AF37] dark:to-[#C9A961] flex items-center justify-center text-white dark:text-[#0B1120] font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-[#94A3B8]">
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
      <section className="py-24 bg-[#F0F9FF] dark:bg-[#0B1120] border-t border-slate-100 dark:border-[#2D4A77]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] dark:text-white mb-4">
              What to Expect: The Timeline
            </h2>
            <p className="text-slate-500 dark:text-[#94A3B8] text-lg">
              Clinical results accumulate over time. Consistency is the key to the protocol.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-blue-50/50 dark:bg-[#1E3A5F] border border-blue-100 dark:border-[#2D4A77] hover:border-blue-200 dark:hover:border-[#D4AF37]/50 transition-all hover:-translate-y-1">
              <div className="text-xs font-extrabold text-[#2563EB] dark:text-[#D4AF37] uppercase tracking-widest mb-3 bg-white dark:bg-[#0B1120] inline-block px-3 py-1 rounded-full border border-blue-100 dark:border-[#2D4A77]">
                Week 1
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-3">Calm & Clarity</h3>
              <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                Cortisol levels begin to stabilize. You may notice easier sleep onset and reduced morning grogginess.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-blue-50/50 dark:bg-[#1E3A5F] border border-blue-100 dark:border-[#2D4A77] hover:border-blue-200 dark:hover:border-[#D4AF37]/50 transition-all hover:-translate-y-1">
              <div className="text-xs font-extrabold text-[#2563EB] dark:text-[#D4AF37] uppercase tracking-widest mb-3 bg-white dark:bg-[#0B1120] inline-block px-3 py-1 rounded-full border border-blue-100 dark:border-[#2D4A77]">
                Week 4
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-3">Deep Restoration</h3>
              <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                Full clinical saturation. Users report significantly improved sleep quality and reduced daytime fatigue.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-blue-50/50 dark:bg-[#1E3A5F] border border-blue-100 dark:border-[#2D4A77] hover:border-blue-200 dark:hover:border-[#D4AF37]/50 transition-all hover:-translate-y-1">
              <div className="text-xs font-extrabold text-[#2563EB] dark:text-[#D4AF37] uppercase tracking-widest mb-3 bg-white dark:bg-[#0B1120] inline-block px-3 py-1 rounded-full border border-blue-100 dark:border-[#2D4A77]">
                Week 8+
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-3">Optimized Performance</h3>
              <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                Sustained stress resilience. Peak cognitive function and energy levels are restored.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Wellness Plan Personalizer */}
      <WellnessPlanPersonalizer />

      {/* Who This Is For - Qualification Section */}
      <section className="py-24 bg-white dark:bg-[#0B1120] transition-colors duration-500">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-[#C9A961]/10 text-[#1E3A5F] dark:text-[#D4AF37] border-[#C9A961]/30">
                Is This Right for You?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E3A5F] dark:text-white">
                Who This Is For (And Who It's Not)
              </h2>
              <p className="text-xl text-muted-foreground dark:text-[#94A3B8]">
                Optibio works best for people dealing with specific challenges. Here's how to know if it's right for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* This IS for you */}
              <Card className="border border-[#C9A961] dark:border-[#D4AF37] bg-gradient-to-br from-[#F7F4EF]/50 to-white dark:from-[#24426A] dark:to-[#1E3A5F] dark:shadow-[0_0_20px_rgba(212,175,55,0.15)] shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C9A961]/10 dark:bg-[#D4AF37]/20 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-[#C9A961] dark:text-[#22C55E]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">This IS for you if:</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] dark:text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="text-slate-700 dark:text-[#F0F0F0]">You're dealing with <strong className="dark:text-white">chronic stress</strong> from work, family, or life transitions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] dark:text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="text-slate-700 dark:text-[#F0F0F0]">You struggle with <strong className="dark:text-white">racing thoughts</strong> or difficulty falling asleep</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] dark:text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="text-slate-700 dark:text-[#F0F0F0]">You feel <strong className="dark:text-white">mentally foggy</strong> or can't focus like you used to</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] dark:text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="text-slate-700 dark:text-[#F0F0F0]">You're <strong className="dark:text-white">exhausted but wired</strong>—tired all day, restless at night</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] dark:text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="text-slate-700 dark:text-[#F0F0F0]">You want a <strong className="dark:text-white">science-backed solution</strong>, not just "wellness hype"</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] dark:text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="text-slate-700 dark:text-[#F0F0F0]">You're willing to <strong className="dark:text-white">commit to 8-12 weeks</strong> for real results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* This is NOT for you */}
              <Card className="border border-[#C9A961] dark:border-[#C9A961] bg-gradient-to-br from-[#F7F4EF]/50 to-white dark:from-[#1E3A5F] dark:to-[#152B45] shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#6B7280]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-600 dark:text-[#6B7280]">✕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">This is NOT for you if:</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-[#6B7280] flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600 dark:text-[#94A3B8]">You're looking for <strong className="dark:text-[#E5E5E5]">instant energy</strong> or a caffeine replacement</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-[#6B7280] flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600 dark:text-[#94A3B8]">You want <strong className="dark:text-[#E5E5E5]">overnight results</strong> (adaptogens take time to work)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-[#6B7280] flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600 dark:text-[#94A3B8]">You're not willing to <strong className="dark:text-[#E5E5E5]">take it consistently</strong> for at least a month</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-[#6B7280] flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600 dark:text-[#94A3B8]">You're pregnant, nursing, or have a <strong className="dark:text-[#E5E5E5]">thyroid condition</strong> (consult your doctor first)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-[#6B7280] flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600 dark:text-[#94A3B8]">You prefer <strong className="dark:text-[#E5E5E5]">cheap supplements</strong> over premium, tested quality</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-[#6B7280] flex-shrink-0 mt-1 font-bold">✕</span>
                      <p className="text-slate-600 dark:text-[#94A3B8]">You're looking for a <strong className="dark:text-[#E5E5E5]">magic pill</strong> instead of a wellness tool</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-[#F7F4EF] dark:bg-[#1E3A5F] border-2 border-[#C9A961]/30 dark:border-[#2D4A77] rounded-2xl p-8 max-w-2xl mx-auto">
                <p className="text-lg text-slate-700 dark:text-white leading-relaxed">
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
          image={mainProduct.imageUrl || "/bottlemockbluegold_beigebg.png"}
          threshold={600}
        />
      )}

      {/* Featured Product */}
      {mainProduct && (
        <section className="py-24 bg-white dark:bg-[#0B1120] transition-colors duration-500">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden border-2 dark:border-[#2D4A77] shadow-2xl dark:bg-[#1E3A5F]">
                <div className="grid md:grid-cols-2">
                  {/* Product Image - Clean background with subtle gold glow in dark mode */}
                  <div className="relative bg-white dark:bg-[#0B1120] p-12 flex items-center justify-center overflow-hidden">
                    {/* Subtle gold glow behind bottle - ALWAYS visible for luxury aesthetic */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[60%] h-[70%] bg-gradient-radial from-[#C9A961]/20 via-[#C9A961]/8 to-transparent blur-3xl dark:from-[#D4AF37]/15 dark:via-[#D4AF37]/5" />
                    </div>
                    <img 
                      src="/bottlemockbluegold_beigebg.png"
                      alt={`${mainProduct.name} - Premium KSM-66 Ashwagandha supplement for stress relief, sleep support, and natural energy`}
                      className="w-full max-w-xs relative z-10"
                      style={{ filter: 'drop-shadow(0 0 15px rgba(201, 169, 97, 0.3))' }}
                    />
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                      <Badge className="bg-gradient-to-r from-[#1E3A5F] to-[#C9A961]">
                        Best Seller
                      </Badge>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {mainProduct.name}
                      </h3>
                      <p className="text-lg text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                        Premium full-spectrum Ashwagandha root extract standardized to 5% withanolides. Clinically studied KSM-66® formula for stress management, mental clarity, and overall wellness.
                      </p>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <div className="text-4xl font-bold text-slate-900 dark:text-[#D4AF37]">
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
                      <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                        <span>90 capsules - 45-day supply</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                        <span>300mg per capsule (600mg clinical dose with 2 capsules)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                        <span>60-day money-back guarantee</span>
                      </div>
                    </div>

                    <Link href="/shop">
                      <Button 
                        size="lg" 
                        className="w-full text-lg py-6 btn-metallic-gold text-white font-bold transition-all duration-300"
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
      <section className="py-24 bg-[#F7F4EF] dark:bg-[#0F172A]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E3A5F] dark:text-white">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-600 dark:text-[#94A3B8]">
              See what our customers are saying about their Optibio experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-white dark:bg-[#1E3A5F] shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-[#2D4A77]">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-1.5 text-[#FFD700] dark:text-[#D4AF37]">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 fill-current dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-[#94A3B8] leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#2D4A77]">
                    <div>
                      <div className="font-bold text-[#1E3A5F] dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-600 dark:text-[#94A3B8]">{testimonial.role}</div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
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
      <section className="py-24 bg-white dark:bg-[#0B1120] transition-colors duration-500">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E3A5F] dark:text-white">
              Quality You Can Trust
            </h2>
            <p className="text-xl text-muted-foreground dark:text-[#94A3B8]">
              Every bottle meets the highest standards of purity, potency, and safety
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, i) => (
              <div 
                key={i} 
                className="text-center space-y-4 p-8 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#1E3A5F] transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A5F]/10 to-[#C9A961]/10 dark:from-[#D4AF37]/20 dark:to-[#C9A961]/20 flex items-center justify-center mx-auto">
                  <cert.icon className="w-8 h-8 text-[#1E3A5F] dark:text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {cert.text}
                </h3>
                <p className="text-slate-600 dark:text-[#94A3B8]">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-[#1E3A5F] to-[#0D1B2A] text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
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
                  className="text-lg px-8 py-6 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] hover:from-[#C9A961] hover:to-[#D4AF37] text-[#0B1120] font-bold shadow-glow-gold"
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
              <Badge className="bg-[#D4AF37] text-[#0B1120] font-bold text-lg px-6 py-2 mb-4">
                LIMITED TIME OFFER
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Save 29% on Your First Order
              </h2>
              <p className="text-xl text-[#F7F4EF] max-w-2xl mx-auto mb-6">
                Premium KSM-66 Ashwagandha at an unbeatable price. Free shipping on orders over $75.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Single Bottle - Entry Option */}
              <Card className="bg-white/10 backdrop-blur-sm border-[#D4AF37]/40 hover:border-[#D4AF37]/70 transition-all relative">
                <CardContent className="p-8">
                  <Zap className="w-10 h-10 text-[#D4AF37] mb-4" />
                  <h3 className="font-bold text-2xl mb-3">Single Bottle</h3>
                  <div className="mb-4">
                    <p className="text-4xl font-bold mb-2">$49.99</p>
                    <p className="text-lg text-[#F7F4EF]">90 capsules • 45-day supply</p>
                    <p className="text-sm text-[#D4AF37] mt-2">Save 15% vs retail ($58.82)</p>
                  </div>
                  <ul className="space-y-2 mb-6 text-[#F7F4EF]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Perfect for first-time buyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Free shipping on orders $75+</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>90-day money-back guarantee</span>
                    </li>
                  </ul>
                  <Link href="/shop" className="block">
                    <Button variant="outline" className="w-full bg-transparent border-2 border-[#D4AF37]/40 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 text-white/70 hover:text-white/90 font-medium text-lg py-6 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 3-Month Bundle - Most Popular */}
              <Card className="bg-white/10 backdrop-blur-sm border-3 border-[#D4AF37] shadow-glow-gold hover:shadow-glow-gold-lg transition-all relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-[#0B1120] font-bold text-sm px-6 py-1.5 shadow-lg">
                    ⭐ MOST POPULAR
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <Star className="w-10 h-10 text-[#D4AF37] mb-4" />
                  <h3 className="font-bold text-2xl mb-3">3-Month Bundle</h3>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold">$127</p>
                      <p className="text-xl text-[#F7F4EF]/60 line-through">$149.97</p>
                    </div>
                    <p className="text-lg text-[#F7F4EF] mt-1">270 capsules • 135-day supply</p>
                    <p className="text-sm text-[#D4AF37] mt-2 font-bold">Save $22.97 (15% off) + FREE shipping</p>
                  </div>
                  <ul className="space-y-2 mb-6 text-[#F7F4EF]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Best value - $42.33/bottle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>FREE shipping (save $7.99)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Full 90-day trial period covered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>See results through week 8+ optimal phase</span>
                    </li>
                  </ul>
                  <Link href="/shop" className="block">
                    <Button className="w-full btn-metallic-gold text-white font-extrabold text-lg py-6 shadow-glow-gold transition-all">
                      Get Best Value
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Link href="/shop">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#D4AF37] to-[#C9A961] hover:from-[#C9A961] hover:to-[#D4AF37] text-[#0B1120] font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-glow-gold transition-all"
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

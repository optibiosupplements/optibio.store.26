import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Shield, Truck, FlaskConical } from "lucide-react";
import { formatPrice } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Shop() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  
  // Assuming the first product is the main KSM-66 bottle
  const product = products?.[0];
  
  if (isLoading) return <div className="min-h-screen bg-[#0A1628]" />;
  
  return (
    <div className="min-h-screen font-sans bg-[#0A1628] text-white">
      {/* 1. DARK NAVY BACKGROUND (Midnight Sophistication) */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#0A1628] via-[#1E3A5F] to-[#152B45]" />
      
      {/* 2. HERO HEADER */}
      <section className="pt-32 pb-16 text-center px-6">
        <Badge className="bg-[#C9A961]/10 text-[#C9A961] border-[#C9A961]/30 hover:bg-[#C9A961]/20 mb-6 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
          Store
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
          The Protocol.
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Pharmaceutical-grade adaptogens engineered for stress resilience and deep recovery.
        </p>
      </section>
      
      {/* 3. PRODUCT FEATURE SECTION (Replaces Grid) */}
      <section className="container max-w-6xl mx-auto px-6 pb-24">
        {product && (
          <div className="bg-[#152B45] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-[#1E3A5F] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Visual */}
              <div className="relative bg-gradient-to-b from-[#1E3A5F] to-[#152B45] p-12 flex items-center justify-center border-r border-[#1E3A5F]">
                <div className="absolute top-8 left-8">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-bold px-3 py-1">In Stock</Badge>
                </div>
                {/* Floating Bottle Effect */}
                <img
                  src="/products/optibio-90cap-bottle-front.jpg"
                  alt={product.name}
                  className="w-full max-w-[320px] h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Right: Details & Conversion */}
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-[#C9A961]">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-sm font-semibold text-slate-400">2,847 Reviews</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {product.name}
                </h2>
                
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  High-potency KSM-66® extract. Standardized to 5% withanolides for maximum cortisol regulation and sleep support.
                </p>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-[#1E3A5F]/50 border border-[#1E3A5F]">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Potency</div>
                    <div className="text-lg font-bold text-white">600mg <span className="text-sm font-normal text-slate-400">/ day</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1E3A5F]/50 border border-[#1E3A5F]">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Supply</div>
                    <div className="text-lg font-bold text-white">45 Days</div>
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-end gap-4 mb-8">
                  <div className="text-5xl font-bold text-white">{formatPrice(product.priceInCents)}</div>
                  {product.compareAtPriceInCents && (
                    <div className="text-xl text-slate-400 line-through mb-2">
                      {formatPrice(product.compareAtPriceInCents)}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link href={`/product/${product.slug}`}>
                    <Button className="w-full h-16 text-lg bg-[#C9A961] hover:bg-[#D4B76E] text-[#0A1628] rounded-xl font-bold shadow-xl shadow-[#C9A961]/20 transition-all hover:-translate-y-1">
                      Shop Now - Risk Free
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-slate-400 font-medium mt-2 flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3" />
                    90-Day Money-Back Guarantee • Free US Shipping
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* 4. TRUST BADGES (The Footer Anchor) */}
      <section className="border-t border-[#1E3A5F] bg-[#152B45]/50 backdrop-blur-md py-12">
        <div className="container max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "3rd Party Tested", sub: "Purity Verified" },
            { icon: FlaskConical, title: "KSM-66® Formula", sub: "Clinical Strength" },
            { icon: CheckCircle2, title: "FDA Registered", sub: "GMP Facility" },
            { icon: Truck, title: "Fast Shipping", sub: "Free over $75" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity group">
              <div className="p-3 bg-[#C9A961]/10 rounded-full group-hover:bg-[#C9A961]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#C9A961]" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">{item.title}</div>
                <div className="text-xs text-slate-400">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

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
  
  if (isLoading) return <div className="min-h-screen bg-white" />;
  
  return (
    <div className="min-h-screen font-sans text-[#1E3A5F]">
      {/* 1. CLINICAL BACKGROUND */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F8FCFE] via-[#EBF5FB] to-[#D6EAF8]" />
      
      {/* 2. HERO HEADER */}
      <section className="pt-32 pb-16 text-center px-6">
        <Badge className="bg-[#1E3A5F]/5 text-[#1E3A5F] border-[#1E3A5F]/20 hover:bg-[#1E3A5F]/10 mb-6 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
          Store
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-[#1E3A5F]">
          The Protocol.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Pharmaceutical-grade adaptogens engineered for stress resilience and deep recovery.
        </p>
      </section>
      
      {/* 3. PRODUCT FEATURE SECTION (Replaces Grid) */}
      <section className="container max-w-6xl mx-auto px-6 pb-24">
        {product && (
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(30,58,95,0.08)] border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Visual */}
              <div className="relative bg-gradient-to-b from-slate-50 to-white p-12 flex items-center justify-center border-r border-slate-50">
                <div className="absolute top-8 left-8">
                  <Badge className="bg-green-100 text-green-700 border-0 font-bold">In Stock</Badge>
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
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E3A5F]">
                  {product.name}
                </h2>
                
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  High-potency KSM-66® extract. Standardized to 5% withanolides for maximum cortisol regulation and sleep support.
                </p>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Potency</div>
                    <div className="text-lg font-bold text-[#1E3A5F]">600mg <span className="text-sm font-normal text-slate-400">/ day</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Supply</div>
                    <div className="text-lg font-bold text-[#1E3A5F]">45 Days</div>
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-end gap-4 mb-8">
                  <div className="text-5xl font-bold text-[#1E3A5F]">{formatPrice(product.priceInCents)}</div>
                  {product.compareAtPriceInCents && (
                    <div className="text-xl text-slate-400 line-through mb-2">
                      {formatPrice(product.compareAtPriceInCents)}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link href={`/product/${product.slug}`}>
                    <Button className="w-full h-16 text-lg bg-[#1E3A5F] hover:bg-[#2563EB] text-white rounded-xl font-bold shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-1">
                      Shop Now - Risk Free
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-slate-400 font-medium mt-2">
                    90-Day Money-Back Guarantee • Free US Shipping
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* 4. TRUST BADGES (The Footer Anchor) */}
      <section className="border-t border-slate-200 bg-white/50 backdrop-blur-md py-12">
        <div className="container max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "3rd Party Tested", sub: "Purity Verified" },
            { icon: FlaskConical, title: "KSM-66® Formula", sub: "Clinical Strength" },
            { icon: CheckCircle2, title: "FDA Registered", sub: "GMP Facility" },
            { icon: Truck, title: "Fast Shipping", sub: "Free over $75" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
              <item.icon className="w-8 h-8 text-[#1E3A5F]" />
              <div>
                <div className="font-bold text-[#1E3A5F] text-sm">{item.title}</div>
                <div className="text-xs text-slate-500">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

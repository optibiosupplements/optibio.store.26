import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Shield, Truck, FlaskConical } from "lucide-react";
import { formatPrice } from "@/const";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";

export default function Shop() {
  const { theme } = useTheme();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  
  // Assuming the first product is the main KSM-66 bottle
  const product = products?.[0];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0B1120]" style={{
        background: theme === 'dark' ? '#0B1120' : 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen font-sans" style={{
      background: theme === 'dark' ? '#0B1120' : 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)'
    }}>
      {/* HERO HEADER - Clinical Light Theme */}
      <section className="pt-32 pb-16 text-center px-6">
        <Badge className="bg-[#1E3A5F]/5 text-[#1E3A5F] dark:text-white border-[#1E3A5F]/20 hover:bg-[#1E3A5F]/10 mb-6 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
          STORE
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-[#1E3A5F] dark:text-white">
          The Protocol.
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
          Pharmaceutical-grade adaptogens engineered for stress resilience and deep recovery.
        </p>
      </section>
      
      {/* PRODUCT FEATURE SECTION - Full-width Hero Card */}
      <section className="container max-w-6xl mx-auto px-6 pb-24">
        {product && (
          <div className="bg-[var(--color-bg-card)] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(30,58,95,0.08)] border border-[var(--color-border-card)] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Visual */}
              <div className="relative bg-gradient-to-b from-[var(--optibio-ivory)] to-white p-12 flex items-center justify-center border-r border-[var(--color-border)]">
                <div className="absolute top-8 left-8">
                  <Badge className="bg-[var(--optibio-success)]/10 text-[var(--optibio-success)] border-0 font-bold px-3 py-1">In Stock</Badge>
                </div>
                {/* Floating Bottle Effect */}
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029571508/pbAYuSGEDTmqczCe.png"
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
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">2,847 Reviews</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E3A5F] dark:text-white">
                  {product.name}
                </h2>
                
                <p className="text-[var(--color-text-secondary)] text-lg mb-8 leading-relaxed">
                  High-potency KSM-66® extract. Standardized to 5% withanolides for maximum cortisol regulation and sleep support.
                </p>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-[var(--optibio-ivory)] border border-[var(--color-border)]">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Potency</div>
                    <div className="text-lg font-bold text-[var(--color-text-primary)]">600mg <span className="text-sm font-normal text-[var(--color-text-secondary)]">/ day</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--optibio-ivory)] border border-[var(--color-border)]">
                    <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Supply</div>
                    <div className="text-lg font-bold text-[var(--color-text-primary)]">45 Days</div>
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-end gap-4 mb-8">
                  <div className="text-5xl font-bold text-[#1E3A5F] dark:text-white">{formatPrice(product.priceInCents)}</div>
                  {product.compareAtPriceInCents && (
                    <div className="text-xl text-[var(--color-text-secondary)] line-through mb-2">
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
                  <p className="text-center text-xs text-[var(--color-text-secondary)] font-medium mt-2 flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3" />
                    90-Day Money-Back Guarantee • Free US Shipping
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* TRUST BADGES - Medical Spec Sheet */}
      <section className="border-t border-[var(--color-border)] bg-white dark:bg-[#1E3A5F]/50 backdrop-blur-md py-12">
        <div className="container max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "3rd Party Tested", sub: "Purity Verified" },
            { icon: FlaskConical, title: "KSM-66® Formula", sub: "Clinical Strength" },
            { icon: CheckCircle2, title: "FDA Registered", sub: "GMP Facility" },
            { icon: Truck, title: "Fast Shipping", sub: "Free over $75" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <item.icon className="w-8 h-8 text-[#1E3A5F] dark:text-white" />
              <div>
                <div className="font-bold text-[#1E3A5F] dark:text-white text-sm leading-tight">{item.title}</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* FDA Disclaimer */}
        <div className="container max-w-4xl mx-auto px-6 mt-8 pt-6 border-t border-[var(--color-border)]">
          <p className="text-xs text-center text-[var(--color-text-secondary)] leading-relaxed">
            *These statements have not been evaluated by the Food and Drug Administration. 
            This product is not intended to diagnose, treat, cure, or prevent any disease. 
            Consult your healthcare provider before starting any supplement regimen.
          </p>
        </div>
      </section>
    </div>
  );
}

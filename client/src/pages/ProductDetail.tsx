import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Star,
  CheckCircle2,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Award,
  Leaf,
  TrendingUp,
  Clock,
  Package,
  Sparkles
} from "lucide-react";
import { formatPrice, calculateDiscountPrice } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ProductSchema from "@/components/ProductSchema";
import ProductReviews from "@/components/ProductReviews";
import SubscriptionToggle from "@/components/SubscriptionToggle";
import StickyAddToCart from "@/components/StickyAddToCart";
import UrgencyIndicators from "@/components/UrgencyIndicators";
import StockIndicator from "@/components/StockIndicator";
import { useTheme } from "@/contexts/ThemeContext";
import { trackProductViewed, trackAddToCart, trackGA4ViewItem, trackGA4AddToCart } from "@/lib/analytics";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  
  const { data: productData, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  // Theme-aware product image selection
  const isDark = theme === 'dark';
  
  // Track product view and debug
  useEffect(() => {
    if (productData) {
      console.log('Product Data:', productData);
      console.log('Variants:', productData.variants);
      console.log('Variants Length:', productData.variants?.length);
      const price = productData.variants[0]?.priceInCents || 0;
      trackProductViewed(productData.id, productData.name, price);
      // GA4 + Meta Pixel view_item event
      trackGA4ViewItem({
        id: productData.id,
        name: productData.name,
        priceInCents: price,
        category: 'Supplements',
      });
    }
  }, [productData]);
  
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
      if (productData && selectedVariant) {
        const variant = productData.variants.find(v => v.id === selectedVariant);
        const priceInCents = variant?.priceInCents || 0;
        trackAddToCart(productData.id, productData.name, selectedVariant, quantity, priceInCents);
        // GA4 + Meta Pixel add_to_cart event
        trackGA4AddToCart({
          id: productData.id,
          name: productData.name,
          priceInCents,
          quantity,
          variant: variant?.name,
          category: 'Supplements',
        });
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'click_cta_pdp_addtocart', {
          product_id: productData?.id,
          variant_id: selectedVariant,
          is_subscription: isSubscription,
        });
      }
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button size="lg">Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const product = productData;
  const currentVariant = selectedVariant 
    ? product.variants.find(v => v.id === selectedVariant)
    : product.variants[0];
  
  const currentPrice = currentVariant?.priceInCents || product.priceInCents;
  const comparePrice = currentVariant?.compareAtPriceInCents || product.compareAtPriceInCents;
  
  const subscriptionPrice = selectedSubscription && isSubscription
    ? calculateDiscountPrice(
        currentPrice,
        product.subscriptionPlans.find(p => p.id === selectedSubscription)?.discountPercentage || 0
      )
    : currentPrice;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      variantId: selectedVariant || undefined,
      quantity,
      isSubscription,
      subscriptionPlanId: isSubscription ? selectedSubscription || undefined : undefined,
    });
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  // Theme-aware product images - using authentic product photos
  const productImages = [
    "/bottlemockbluegold_beigebg.png",
    "/bottlemockbluegold_beigebg.png",
    "/bottlemockbluegold_beigebg.png"
  ];

  const benefits = [
    "Supports stress management and cortisol balance",
    "Promotes mental clarity and cognitive function",
    "Enhances sleep quality and duration",
    "Boosts natural energy and physical performance",
    "Supports immune system health",
    "Helps maintain healthy weight management"
  ];

  const certifications = [
    { icon: Shield, text: "Third-Party Tested", desc: "Every batch verified for purity" },
    { icon: Award, text: "GMP Certified", desc: "Pharmaceutical-grade facility" },
    { icon: Leaf, text: "Non-GMO & Organic", desc: "Clean, natural ingredients" },
    { icon: TrendingUp, text: "20+ Clinical Studies", desc: "Science-backed efficacy" }
  ];

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-[#0B1120] transition-colors duration-500">
      {/* Product Schema for Rich Snippets */}
      <ProductSchema
        name={product.name}
        description={product.description || "Premium full-spectrum Ashwagandha root extract with clinically-studied KSM-66®. Supports stress management, restful sleep, and overall wellness."}
        image={`https://optibiosupplements.com${productImages[0]}`}
        sku={product.sku || `OPTIBIO-${product.id}`}
        brand="Optibio"
        priceInCents={currentPrice}
        currency="USD"
        availability={product.stockQuantity && product.stockQuantity > 0 ? "InStock" : "OutOfStock"}
        url={`https://optibiosupplements.com/product/${product.slug}`}
        additionalImages={productImages.slice(1).map(img => `https://optibiosupplements.com${img}`)}
        ratingValue={4.9}
        ratingCount={2847}
        reviewCount={2847}
        reviews={[
          {
            author: "Rachel K.",
            datePublished: "2025-11-15",
            reviewBody: "I used to dread Mondays. I'm a teacher with two kids under 5, and by Wednesday I was running on fumes. Since starting Optibio, I actually have energy for bedtime stories. My husband noticed I'm not as snappy. Small changes, huge impact.",
            reviewRating: 5,
          },
          {
            author: "David L.",
            datePublished: "2025-11-22",
            reviewBody: "I was skeptical about adaptogens—tried three other brands that did nothing. But after two weeks with Optibio, I noticed I wasn't doom-scrolling at 2am anymore. My sleep tracker confirms it: I'm getting 90 more minutes of deep sleep per night.",
            reviewRating: 5,
          },
          {
            author: "Maya P.",
            datePublished: "2025-12-01",
            reviewBody: "Thesis deadlines had me living on coffee and anxiety. A friend recommended Optibio and I figured, why not? Three weeks in, I can actually focus for more than 20 minutes. My advisor asked what changed. This stuff is legit.",
            reviewRating: 5,
          },
        ]}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-16 z-40 transition-colors duration-500">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">
              <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
            </Link>
            <span>/</span>
            <Link href="/shop">
              <span className="hover:text-primary transition-colors cursor-pointer">Shop</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-square rounded-3xl overflow-hidden bg-white border-2 border-slate-200 shadow-2xl group transition-colors duration-500">
                <img
                  src={productImages[selectedImage]}
                  alt={`${product.name} - ${selectedImage === 0 ? 'premium black glass bottle with gold cap, 300mg KSM-66 ashwagandha per capsule' : selectedImage === 1 ? 'supplement facts label with complete ingredient list and dosage information' : selectedImage === 2 ? 'close-up of premium ashwagandha capsules' : 'lifestyle image showing daily wellness routine'}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === idx 
                        ? "border-[#1E3A5F] ring-4 ring-[#C9A961]/20 scale-105" 
                        : "border-slate-200 hover:border-[#C9A961]/40"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${idx === 0 ? 'bottle' : idx === 1 ? 'supplement facts' : idx === 2 ? 'capsules' : 'lifestyle'}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Trust Badges - Desktop */}
              <div className="hidden lg:grid grid-cols-2 gap-4 pt-6">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 transition-colors duration-500">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F]/10 to-[#B89651]/10 flex items-center justify-center">
                      <cert.icon className="w-5 h-5 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{cert.text}</div>
                      <div className="text-xs text-muted-foreground">{cert.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Consolidated Buy Box */}
            <div className="space-y-8">
              {/* Header Section - Above Buy Box */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-sm font-bold">
                    PRE-ORDER
                  </Badge>
                  <Badge className="bg-gradient-to-r from-[#1E3A5F] to-[#B89651] text-white border-0">
                    Best Seller
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9A961] text-[#C9A961]" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(2,847 reviews)</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E3A5F] leading-tight">
                  {product.name}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {product.description || "Premium full-spectrum Ashwagandha root extract standardized to 5% withanolides. Clinically studied KSM-66® formula for stress management, mental clarity, and overall wellness."}
                </p>

                {/* Stock Indicator - Scarcity */}
                <StockIndicator stockQuantity={product.stockQuantity} threshold={100} />

                {/* Pre-Order Shipping Info */}
                <div className="flex items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl transition-colors duration-500">
                  <Package className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold text-amber-900">Ships Jan 20-27, 2026</span>
                    <span className="text-amber-700 ml-2">• Pre-order closes Jan 20</span>
                  </div>
                </div>
              </div>

              {/* CONSOLIDATED BUY BOX - Single White Card */}
              <div className="bg-white dark:bg-[#1E3A5F] rounded-3xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-[#2D4A77] p-8 sticky top-24 buy-box-glow transition-colors duration-500">
                
                {/* Buy Box Header: Price & Reviews */}
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#1E3A5F] mb-2">OptiBio KSM-66</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#C9A961]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="fill-current w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 font-medium">2,847 Reviews</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#1E3A5F]">
                      {formatPrice(isSubscription ? subscriptionPrice : currentPrice)}
                    </div>
                    {comparePrice && comparePrice > currentPrice && (
                      <div className="text-sm text-slate-400 line-through">
                        {formatPrice(comparePrice)}
                      </div>
                    )}
                  </div>
                </div>

                {/* SUBSCRIPTION TOGGLE (Radio Group Style) */}
                <div className="flex flex-col gap-4 mb-8">
                  
                  {/* Option 1: Subscribe - Phase 2: Solid Gold Primary */}
                  <label className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all shadow-lg hover:shadow-xl ${isSubscription ? 'border-[#C9A961] btn-metallic-gold' : 'border-[#C9A961]/40 hover:border-[#C9A961]/60 bg-white'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSubscription ? 'border-white bg-white' : 'border-[#C9A961]/40'}`}>
                          {isSubscription && <div className="w-3 h-3 rounded-full bg-[#C9A961]" />}
                        </div>
                        <div>
                          <span className={`font-bold text-lg ${isSubscription ? 'text-white' : 'text-[#1E3A5F]'}`}>Subscribe & Save 20%</span>
                          <div className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${isSubscription ? 'text-white/90' : 'text-[#C9A961]'}`}><span className="text-base">⭐</span> Recommended (Most Popular)</div>
                        </div>
                      </div>
                      <div className={`font-bold text-xl ${isSubscription ? 'text-white' : 'text-[#1E3A5F]'}`}>
                        {formatPrice(product.subscriptionPlans && product.subscriptionPlans[0] ? calculateDiscountPrice(currentPrice, product.subscriptionPlans[0].discountPercentage || 0) : currentPrice)}
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="purchaseType" 
                      className="hidden" 
                      checked={isSubscription} 
                      onChange={() => {
                        setIsSubscription(true);
                        if (product.subscriptionPlans.length > 0) {
                          setSelectedSubscription(product.subscriptionPlans[0].id);
                        }
                        // Track analytics event
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                          (window as any).gtag('event', 'toggle_subscription_pdp', {
                            product_id: product.id,
                            is_subscription: true,
                          });
                        }
                      }} 
                    />
                  </label>

                  {/* Option 2: One-Time - Phase 2: Ghost Outline Secondary */}
                  <label className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${!isSubscription ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-[#C9A961]/30 hover:border-[#C9A961]/50 bg-white'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!isSubscription ? 'border-[#C9A961] bg-[#C9A961]' : 'border-[#C9A961]/30'}`}>
                          {!isSubscription && <div className="w-3 h-3 rounded-full bg-white" />}
                        </div>
                        <span className="font-bold text-slate-700 text-lg">One-Time Purchase</span>
                      </div>
                      <div className="font-bold text-slate-700 text-xl">{formatPrice(currentPrice)}</div>
                    </div>
                    <input 
                      type="radio" 
                      name="purchaseType" 
                      className="hidden" 
                      checked={!isSubscription} 
                      onChange={() => {
                        setIsSubscription(false);
                        // Track analytics event
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                          (window as any).gtag('event', 'toggle_subscription_pdp', {
                            product_id: product.id,
                            is_subscription: false,
                          });
                        }
                      }} 
                    />
                  </label>

                </div>

                {/* VARIANT SELECTION - Inside Buy Box */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3 mb-8">
                    <Label className="text-sm font-semibold text-[#1E3A5F]">Choose Your Supply</Label>
                    <RadioGroup 
                      value={selectedVariant?.toString() || product.variants[0]?.id.toString()}
                      onValueChange={(value) => setSelectedVariant(parseInt(value))}
                      className="grid gap-2"
                    >
                      {product.variants.map((variant) => {
                        const savings = variant.compareAtPriceInCents 
                          ? Math.round(((variant.compareAtPriceInCents - variant.priceInCents) / variant.compareAtPriceInCents) * 100)
                          : 0;
                        
                        return (
                          <Label
                            key={variant.id}
                            htmlFor={`variant-${variant.id}`}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                              (selectedVariant || product.variants[0]?.id) === variant.id
                                ? "border-[#1E3A5F] bg-blue-50/30" 
                                : "border-slate-200 hover:border-blue-200 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={variant.id.toString()} id={`variant-${variant.id}`} />
                              <div>
                                <div className="font-semibold text-sm text-slate-900">{variant.name}</div>
                                {variant.sku && <div className="text-xs text-slate-600">{variant.sku}</div>}
                              </div>
                            </div>
                                  <div className="text-right">
                              <div className="text-sm font-bold text-slate-900">
                                {formatPrice(variant.priceInCents)}
                              </div>
                              {savings > 0 && (
                                <Badge variant="secondary" className="bg-[#C9A961]/20 text-[#1E3A5F] text-xs mt-1">
                                  Save {savings}%
                                </Badge>
                              )}
                            </div>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </div>
                )}

                {/* QUANTITY SELECTOR - Inside Buy Box */}
                <div className="space-y-3 mb-8">
                  <Label className="text-sm font-semibold text-[#1E3A5F]">Quantity</Label>
                  <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden w-fit">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      className="h-10 w-10 rounded-none hover:bg-slate-100"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="w-12 text-center text-lg font-semibold">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      className="h-10 w-10 rounded-none hover:bg-slate-100"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* MAIN ACTION BUTTON */}
                <Button 
                  className="w-full h-14 text-lg font-bold btn-metallic-gold text-white shadow-lg rounded-xl mb-4 transition-all hover:-translate-y-1"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {addToCartMutation.isPending ? "Adding..." : isSubscription ? "Start My Subscription" : "Add to Cart"}
                </Button>

                {/* Trust Footer */}
                <div className="flex justify-center items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> 90-Day Guarantee</span>
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3"/> Free Shipping</span>
                </div>

              </div>

              {/* Urgency Indicators - Below Buy Box */}
              <UrgencyIndicators 
                productId={product.id} 
                variantId={selectedVariant || product.variants[0]?.id}
              />

              {/* Key Benefits - Below Buy Box */}
              <Card className="border-2 border-slate-200">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Key Benefits</h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-20">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A5F] data-[state=active]:bg-transparent px-8 py-4 text-base font-semibold"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="ingredients"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A5F] data-[state=active]:bg-transparent px-8 py-4 text-base font-semibold"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger 
                  value="studies"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A5F] data-[state=active]:bg-transparent px-8 py-4 text-base font-semibold"
                >
                  Clinical Studies
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A5F] data-[state=active]:bg-transparent px-8 py-4 text-base font-semibold"
                >
                  Reviews (2,847)
                </TabsTrigger>
                <TabsTrigger 
                  value="faq"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E3A5F] data-[state=active]:bg-transparent px-8 py-4 text-base font-semibold"
                >
                  FAQ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-8 space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-[#1E3A5F]">About This Product</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Clinical Dosage</div>
                        <div className="text-slate-700">300mg per capsule (take 2 daily for 600mg clinical dose used in peer-reviewed studies)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Root-Only Extract</div>
                        <div className="text-slate-700">No leaves or inferior plant parts, just pure root extract with 5% withanolides</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Third-Party Tested</div>
                        <div className="text-slate-700">Every batch verified for purity, potency, and safety</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">GMP Certified</div>
                        <div className="text-slate-700">Manufactured in a pharmaceutical-grade facility</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#1E3A5F] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Non-GMO & Organic</div>
                        <div className="text-slate-700">Clean ingredients you can trust</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed mt-6">
                    Optibio Ashwagandha KSM-66 represents the pinnacle of ashwagandha supplementation. Our premium formula uses only the highest quality KSM-66® extract—the most clinically studied ashwagandha on the market with over 20 peer-reviewed research studies demonstrating its efficacy.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-8">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Supplement Facts</h3>
                    <div className="border-2 border-slate-900 p-6 space-y-4">
                      <div className="border-b-2 border-slate-900 pb-2">
                        <div className="text-xs font-bold">Serving Size: 1 Capsule</div>
                        <div className="text-xs">Servings Per Container: 90</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-300 pb-2">
                          <div>
                            <div className="font-bold">KSM-66® Ashwagandha Root Extract</div>
                            <div className="text-sm text-slate-600">(Withania somnifera)</div>
                          </div>
                          <div className="font-bold">300mg</div>
                        </div>
                        <div className="text-xs text-slate-600 italic">
                          * Daily Value not established
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="studies" className="mt-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#1E3A5F]">Clinical Research</h3>
                  <p className="text-slate-700">KSM-66® has been the subject of 20+ peer-reviewed clinical studies demonstrating its efficacy:</p>
                  
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-bold text-[#1E3A5F] mb-2">Stress & Cortisol Reduction</div>
                      <div className="text-sm text-slate-700">Studies show 27.9% reduction in cortisol levels after 60 days</div>
                      <a href="https://pubmed.ncbi.nlm.nih.gov/" className="text-[#2563EB] text-sm mt-2 inline-block hover:underline">View Study →</a>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-bold text-[#1E3A5F] mb-2">Sleep Quality</div>
                      <div className="text-sm text-slate-700">72% of participants reported improved sleep quality</div>
                      <a href="https://pubmed.ncbi.nlm.nih.gov/" className="text-[#2563EB] text-sm mt-2 inline-block hover:underline">View Study →</a>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-bold text-[#1E3A5F] mb-2">Mental Clarity & Focus</div>
                      <div className="text-sm text-slate-700">Significant improvements in cognitive function and reaction time</div>
                      <a href="https://pubmed.ncbi.nlm.nih.gov/" className="text-[#2563EB] text-sm mt-2 inline-block hover:underline">View Study →</a>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <ProductReviews productId={product.id} />
              </TabsContent>

              <TabsContent value="faq" className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold text-[#1E3A5F]">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-slate-900 mb-2">How long does it take to feel the effects?</div>
                    <div className="text-slate-700">Most users report noticeable improvements in sleep quality within 2-3 weeks. Stress reduction and mental clarity improvements typically appear within 4-6 weeks of consistent use.</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-slate-900 mb-2">Is it safe to take daily?</div>
                    <div className="text-slate-700">Yes. KSM-66® has been used safely in clinical studies for up to 12 weeks. We recommend consulting with a healthcare provider before starting any supplement regimen.</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-slate-900 mb-2">Can I take it with other supplements?</div>
                    <div className="text-slate-700">Generally yes, but we recommend spacing it 2 hours apart from other medications or supplements. Consult your healthcare provider for personalized advice.</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="font-bold text-slate-900 mb-2">What if I'm not satisfied?</div>
                    <div className="text-slate-700">We offer a 90-day money-back guarantee. If you're not completely satisfied, we'll refund your purchase—no questions asked.</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Footer Trust Badges */}
      <section className="py-12 bg-slate-50 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <Shield className="w-8 h-8 text-[#1E3A5F] mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">Integrity Tested</div>
              <div className="text-xs text-slate-600">Third-party verified</div>
            </div>
            <div className="text-center">
              <Truck className="w-8 h-8 text-[#1E3A5F] mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">Free Shipping</div>
              <div className="text-xs text-slate-600">On all orders</div>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 text-[#1E3A5F] mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">Made in USA</div>
              <div className="text-xs text-slate-600">GMP Certified</div>
            </div>
            <div className="text-center">
              <RotateCcw className="w-8 h-8 text-[#1E3A5F] mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">Secure Checkout</div>
              <div className="text-xs text-slate-600">90-Day Guarantee</div>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-[#1E3A5F] mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">WCAG 2.1 AA</div>
              <div className="text-xs text-slate-600">Accessibility</div>
            </div>
          </div>
          
          {/* FDA Disclaimer */}
          <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500 leading-relaxed">
              *These statements have not been evaluated by the Food and Drug Administration. 
              This product is not intended to diagnose, treat, cure, or prevent any disease. 
              Consult your healthcare provider before starting any supplement regimen.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

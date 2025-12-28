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

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  
  const { data: productData, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  // Theme-aware product image selection
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Debug: Log product data to see variants
  useEffect(() => {
    if (productData) {
      console.log('Product Data:', productData);
      console.log('Variants:', productData.variants);
      console.log('Variants Length:', productData.variants?.length);
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
          <h2 className="text-3xl font-bold">Product Not Found</h2>
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

  // Theme-aware product images - automatically switch based on dark mode
  const productImages = isDark ? [
    "/products/optibio-90cap-bottle-front-dark.jpg",
    "/products/optibio-product-dark-angle1.jpg",
    "/products/optibio-product-dark-angle2.jpg"
  ] : [
    "/products/optibio-90cap-bottle-front.jpg",
    "/products/optibio-90cap-bottle-angle.jpg",
    "/products/optibio-lifestyle-professional.jpg"
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
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)' }}>
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
      <div className="border-b bg-white/80 dark:bg-card/80 backdrop-blur-sm sticky top-16 z-40 transition-colors duration-500">
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
              <div className="aspect-square rounded-3xl overflow-hidden bg-white dark:bg-card border-2 border-slate-200 dark:border-border shadow-2xl group transition-colors duration-500">
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
                        ? "border-[#1E3A5F] dark:border-[#C9A961] ring-4 ring-[#C9A961]/20 dark:ring-[#C9A961]/40 scale-105" 
                        : "border-slate-200 dark:border-border hover:border-[#C9A961]/40 dark:hover:border-[#C9A961]/60"
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
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-card border border-slate-200 dark:border-border transition-colors duration-500">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F]/10 to-[#B89651]/10 flex items-center justify-center">
                      <cert.icon className="w-5 h-5 text-[#1E3A5F] dark:text-[#C9A961]" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{cert.text}</div>
                      <div className="text-xs text-muted-foreground">{cert.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              {/* Header */}
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

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {product.description || "Premium full-spectrum Ashwagandha root extract standardized to 5% withanolides. Clinically studied KSM-66® formula for stress management, mental clarity, and overall wellness."}
                </p>

                {/* Stock Indicator - Scarcity */}
                <StockIndicator stockQuantity={product.stockQuantity} threshold={100} />

                {/* Pre-Order Shipping Info */}
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl transition-colors duration-500">
                  <Package className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold text-amber-900 dark:text-amber-400">Ships Jan 20-27, 2026</span>
                    <span className="text-amber-700 dark:text-amber-500 ml-2">• Pre-order closes Jan 20</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 pt-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#1E3A5F] to-[#B89651] bg-clip-text text-transparent">
                    {formatPrice(isSubscription ? subscriptionPrice : currentPrice)}
                  </div>
                  {comparePrice && comparePrice > currentPrice && (
                    <>
                      <div className="text-2xl text-slate-400 line-through">
                        {formatPrice(comparePrice)}
                      </div>
                      <Badge variant="secondary" className="bg-[#C9A961]/20 text-[#1E3A5F] text-sm px-3 py-1">
                        Save {Math.round(((comparePrice - currentPrice) / comparePrice) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>
                {/* Cost per day - Value anchoring */}
                <p className="text-sm text-muted-foreground mt-2">
                  That's just <span className="font-bold text-[#1E3A5F] dark:text-[#C9A961]">${((isSubscription ? subscriptionPrice : currentPrice) / 100 / 45).toFixed(2)}/day</span> for better sleep & less stress
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ☕ Less than your daily coffee
                </p>
              </div>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-foreground">Choose Your Supply</Label>
                  <RadioGroup 
                    value={selectedVariant?.toString() || product.variants[0]?.id.toString()}
                    onValueChange={(value) => setSelectedVariant(parseInt(value))}
                    className="grid gap-3"
                  >
                    {product.variants.map((variant) => {
                      const savings = variant.compareAtPriceInCents 
                        ? Math.round(((variant.compareAtPriceInCents - variant.priceInCents) / variant.compareAtPriceInCents) * 100)
                        : 0;
                      
                      return (
                        <Label
                          key={variant.id}
                          htmlFor={`variant-${variant.id}`}
                          className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            (selectedVariant || product.variants[0]?.id) === variant.id
                              ? "border-[#1E3A5F] bg-[#F7F4EF] ring-4 ring-[#C9A961]/20"
                              : "border-slate-200 hover:border-[#C9A961]/40 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value={variant.id.toString()} id={`variant-${variant.id}`} />
                              <div>
                                <div className="font-semibold text-slate-900">{variant.name}</div>
                                {variant.sku && <div className="text-sm text-slate-600">{variant.sku}</div>}
                              </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-900">
                              {formatPrice(variant.priceInCents)}
                            </div>
                            {savings > 0 && (
                              <Badge variant="secondary" className="bg-[#C9A961]/20 text-[#1E3A5F] text-xs">
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

              {/* Subscription Options - Prominent */}
              {product.subscriptionPlans && product.subscriptionPlans.length > 0 && (
                <SubscriptionToggle
                  oneTimePrice={currentPrice / 100}
                  subscriptionPrice={subscriptionPrice / 100}
                  subscriptionDiscount={product.subscriptionPlans[0]?.discountPercentage || 20}
                  defaultSubscription={true}
                  onSelectionChange={(subscription) => {
                    setIsSubscription(subscription);
                    if (subscription && product.subscriptionPlans.length > 0) {
                      setSelectedSubscription(product.subscriptionPlans[0].id);
                    }
                  }}
                />
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      className="h-14 w-14 rounded-none hover:bg-slate-100"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="w-16 text-center text-xl font-semibold">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      className="h-14 w-14 rounded-none hover:bg-slate-100"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="flex-1 h-14 text-lg bg-gradient-to-r from-[#C9A961] to-[#F7F4EF]0 hover:from-[#F7F4EF]0 hover:to-[#B89651] text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {addToCartMutation.isPending ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 border-2 hover:bg-slate-50"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Truck className="w-5 h-5 text-[#1E3A5F]" />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <RotateCcw className="w-5 h-5 text-[#1E3A5F]" />
                    <span className="font-medium">60-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock className="w-5 h-5 text-[#1E3A5F]" />
                    <span className="font-medium">Ships in 1-2 Days</span>
                  </div>
                </div>
              </div>

              {/* Urgency Indicators */}
              <UrgencyIndicators 
                productId={product.id} 
                variantId={selectedVariant || product.variants[0]?.id}
              />

              {/* Key Benefits */}
              <Card className="border-2 border-slate-200">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Key Benefits</h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
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
                  <h3 className="text-2xl font-bold text-slate-900">About This Product</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Optibio Ashwagandha KSM-66 represents the pinnacle of ashwagandha supplementation. Our premium formula uses only the highest quality KSM-66® extract—the most clinically studied ashwagandha on the market with over 20 peer-reviewed research studies demonstrating its efficacy.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Each capsule contains 300mg of pure KSM-66® root extract, standardized to contain 5% withanolides. Take 2 capsules daily for the 600mg clinical dosage used in research studies. Unlike inferior products that use leaf extracts or lower concentrations, our full-spectrum root-only extract preserves the complete balance of bioactive compounds found in the whole herb.
                  </p>
                  <h4 className="text-xl font-bold text-slate-900 mt-8">Why Choose Optibio?</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li><strong>Clinical Dosage:</strong> 300mg per capsule (take 2 daily for 600mg clinical dose used in peer-reviewed studies)</li>
                    <li><strong>Root-Only Extract:</strong> No leaves or inferior plant parts, just pure root extract</li>
                    <li><strong>Third-Party Tested:</strong> Every batch verified for purity, potency, and safety</li>
                    <li><strong>GMP Certified:</strong> Manufactured in a pharmaceutical-grade facility</li>
                    <li><strong>Non-GMO & Organic:</strong> Clean ingredients you can trust</li>
                  </ul>
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
                            <div className="text-sm text-slate-600">Standardized to 5% Withanolides</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">300 mg</div>
                            <div className="text-sm text-slate-600">**</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 pt-4 border-t border-slate-300">
                        ** Daily Value not established.
                      </div>
                      <div className="text-xs text-slate-600 pt-4">
                        <strong>Other Ingredients:</strong> Hypromellose (capsule), Microcrystalline cellulose, Magnesium stearate.
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-[#F7F4EF] border border-[#C9A961]/20 rounded-lg">
                      <p className="text-sm text-slate-700">
                        <strong>FDA Disclaimer:</strong> These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="studies" className="mt-8">
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-2xl font-bold text-slate-900">Clinical Research</h3>
                    <p className="text-slate-700 leading-relaxed">
                      KSM-66® is the most clinically studied ashwagandha extract on the market, with over 20 peer-reviewed research studies published in respected scientific journals. Here are some key findings:
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-3">
                        <Badge className="bg-[#1E3A5F]">Stress & Anxiety</Badge>
                        <h4 className="font-bold text-lg text-slate-900">44% Reduction in Stress</h4>
                        <p className="text-sm text-slate-600">
                          A 60-day randomized, double-blind, placebo-controlled study showed significant reductions in stress and cortisol levels.
                        </p>
                        <a href="#" className="text-sm text-[#1E3A5F] hover:underline font-medium">
                          View Study →
                        </a>
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-3">
                        <Badge className="bg-[#1E3A5F]">Sleep Quality</Badge>
                        <h4 className="font-bold text-lg text-slate-900">72% Improvement in Sleep</h4>
                        <p className="text-sm text-slate-600">
                          Clinical research demonstrated significant improvements in sleep quality, sleep onset latency, and overall sleep efficiency.
                        </p>
                        <a href="#" className="text-sm text-[#1E3A5F] hover:underline font-medium">
                          View Study →
                        </a>
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-3">
                        <Badge className="bg-[#1E3A5F]">Physical Performance</Badge>
                        <h4 className="font-bold text-lg text-slate-900">27.9% Increase in VO2 Max</h4>
                        <p className="text-sm text-slate-600">
                          Athletes showed significant improvements in cardiorespiratory endurance and recovery time.
                        </p>
                        <a href="#" className="text-sm text-[#1E3A5F] hover:underline font-medium">
                          View Study →
                        </a>
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-3">
                        <Badge className="bg-[#1E3A5F]">Cognitive Function</Badge>
                        <h4 className="font-bold text-lg text-slate-900">Enhanced Memory & Focus</h4>
                        <p className="text-sm text-slate-600">
                          Research showed improvements in immediate and general memory, executive function, and sustained attention.
                        </p>
                        <a href="#" className="text-sm text-[#1E3A5F] hover:underline font-medium">
                          View Study →
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                {productData && <ProductReviews productId={productData.id} />}
              </TabsContent>

              <TabsContent value="faq" className="mt-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
                  
                  <div className="space-y-3">
                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        How long until I feel results?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        Most people notice subtle changes within 2-4 weeks, with peak benefits appearing around 8-12 weeks. You might first notice better sleep, then calmer mornings, then improved focus. Clinical studies show maximum benefits at 8 weeks of consistent daily use.
                      </p>
                    </details>

                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        Can I take this with other supplements?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        Yes! Ashwagandha works well with most supplements. It's commonly paired with magnesium for sleep, vitamin D for immunity, or omega-3s for brain health. However, if you're taking prescription medications (especially thyroid or blood pressure meds), consult your doctor first.
                      </p>
                    </details>

                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        What if I forget to take it?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        No worries! Just take your dose when you remember. Don't double up. Consistency matters more than perfection—taking it 5-6 days a week is better than skipping entire weeks. Set a phone reminder or keep the bottle where you'll see it (next to your coffee maker, toothbrush, etc.).
                      </p>
                    </details>

                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        Is this safe for long-term use?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        Yes. Ashwagandha has been used safely in Ayurvedic medicine for thousands of years. Clinical studies show it's well-tolerated for continuous use up to 12 months. Many people take it daily for years. That said, it's smart to take a 1-2 week break every 3-6 months to reset your body's response.
                      </p>
                    </details>

                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        What's your return policy?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        We offer a 90-day money-back guarantee. Try Optibio for a full 12 weeks. If you don't feel calmer, sleep better, or think more clearly, email us at support@optibio.com and we'll refund every penny. No questions asked. You can even keep the bottle.
                      </p>
                    </details>

                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        When should I take it—morning or night?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        Either works! Some people prefer mornings (helps manage daytime stress), others prefer evenings (promotes restful sleep). Try both and see what feels best. The key is consistency—same time every day helps your body adapt.
                      </p>
                    </details>

                    <details className="group border-2 border-slate-200 rounded-lg p-6 hover:border-[#C9A961]/40 transition-colors">
                      <summary className="cursor-pointer font-semibold text-lg text-slate-900 flex justify-between items-center">
                        Will this make me drowsy?
                        <span className="text-[#C9A961] group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        No. Ashwagandha is an adaptogen, not a sedative. It helps your body manage stress, which can improve sleep quality, but it won't make you groggy or tired during the day. Most people report feeling more energized and focused.
                      </p>
                    </details>
                  </div>

                  <div className="mt-8 p-6 bg-[#F7F4EF] border-2 border-[#C9A961]/30 rounded-lg">
                    <p className="text-slate-700 text-center">
                      <strong className="text-[#1E3A5F]">Still have questions?</strong> Email us at <a href="mailto:support@optibio.com" className="text-[#C9A961] hover:underline font-semibold">support@optibio.com</a> — we typically respond within 2 hours.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Sticky Add-to-Cart Bar */}
      <StickyAddToCart
        productId={product.id}
        productName={product.name}
        price={currentPrice / 100}
        image={productImages[0]}
        threshold={600}
      />
    </div>
  );
}

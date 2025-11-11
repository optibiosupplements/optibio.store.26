import { useState } from "react";
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
} from "lucide-react";
import { formatPrice, calculateDiscountPrice } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  
  const { data: productData, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const { isAuthenticated } = useAuth();
  
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link href="/shop">
            <Button>Return to Shop</Button>
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

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">
              <a className="hover:text-foreground transition-colors">Home</a>
            </Link>
            <span>/</span>
            <Link href="/shop">
              <a className="hover:text-foreground transition-colors">Shop</a>
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden border-2 bg-muted/30">
                <img
                  src={product.imageUrl || "/products/ashwagandha-bottle.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnail Gallery */}
              {product.galleryImages && JSON.parse(product.galleryImages).length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {JSON.parse(product.galleryImages).map((img: string, idx: number) => (
                    <button
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden border-2 hover:border-primary transition-colors"
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.isFeatured && (
                    <Badge variant="secondary">Best Seller</Badge>
                  )}
                  {product.stockQuantity && product.stockQuantity <= (product.lowStockThreshold || 50) && (
                    <Badge variant="destructive">Low Stock</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground">{product.description}</p>

              {/* Price */}
              <div className="border-y py-6 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(isSubscription ? subscriptionPrice : currentPrice)}
                  </span>
                  {comparePrice && (
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatPrice(comparePrice)}
                    </span>
                  )}
                  {comparePrice && (
                    <Badge className="text-sm">
                      Save {Math.round((1 - currentPrice / comparePrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.servingsPerContainer} servings • {product.servingSize}
                </p>
              </div>

              {/* Variant Selection */}
              {product.variants.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Size</Label>
                  <RadioGroup
                    value={selectedVariant?.toString() || product.variants[0]?.id.toString()}
                    onValueChange={(value) => setSelectedVariant(parseInt(value))}
                  >
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={variant.id.toString()} id={`variant-${variant.id}`} />
                        <Label
                          htmlFor={`variant-${variant.id}`}
                          className="flex-1 flex justify-between items-center cursor-pointer"
                        >
                          <span>{variant.name}</span>
                          <span className="font-semibold">{formatPrice(variant.priceInCents)}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Subscription Options */}
              {product.subscriptionPlans.length > 0 && (
                <Card className="border-2 border-secondary/30 bg-secondary/5">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Subscribe & Save</Label>
                      <Badge variant="secondary">Up to 25% Off</Badge>
                    </div>
                    <RadioGroup
                      value={isSubscription ? selectedSubscription?.toString() || "" : "one-time"}
                      onValueChange={(value) => {
                        if (value === "one-time") {
                          setIsSubscription(false);
                        } else {
                          setIsSubscription(true);
                          setSelectedSubscription(parseInt(value));
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time" className="cursor-pointer">
                          One-time purchase
                        </Label>
                      </div>
                      {product.subscriptionPlans.map((plan) => (
                        <div key={plan.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} />
                          <Label
                            htmlFor={`plan-${plan.id}`}
                            className="flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span>{plan.name}</span>
                            <span className="font-semibold text-secondary-foreground">
                              Save {plan.discountPercentage}%
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Cancel or modify anytime. No commitments.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-base font-semibold">Quantity</Label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 text-lg"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <p className="text-xs font-medium">60-Day Guarantee</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <Truck className="h-6 w-6 text-primary" />
                  <p className="text-xs font-medium">Free Shipping $75+</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <RotateCcw className="h-6 w-6 text-primary" />
                  <p className="text-xs font-medium">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="studies">Clinical Studies</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6 space-y-4">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.longDescription || product.description || "" }} />
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Supplement Facts</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Serving Size:</strong> {product.servingSize}</p>
                      <p className="text-sm"><strong>Servings Per Container:</strong> {product.servingsPerContainer}</p>
                    </div>
                    {product.ingredients && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Ingredients:</p>
                        <p className="text-sm text-muted-foreground">{product.ingredients}</p>
                      </div>
                    )}
                    {product.warnings && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-semibold mb-2">Warnings:</p>
                        <p className="text-sm text-muted-foreground">{product.warnings}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="studies" className="mt-6 space-y-4">
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    KSM-66® is backed by 20+ peer-reviewed clinical studies demonstrating its effectiveness.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-2">Stress & Anxiety</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Double-blind, placebo-controlled study showing significant reduction in stress scores.
                        </p>
                        <p className="text-xs text-muted-foreground">Chandrasekhar et al. (2012) - 834 citations</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-2">Sleep Quality</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Meta-analysis showing significant improvement in sleep quality vs. placebo.
                        </p>
                        <p className="text-xs text-muted-foreground">Cheah et al. (2021) - 151 citations</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Link href="/science">
                    <Button variant="outline">View All Studies</Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold">4.9</div>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">2,847 reviews</p>
                    </div>
                    <div className="flex-1">
                      <Button>Write a Review</Button>
                    </div>
                  </div>
                  {/* Review list would go here */}
                  <p className="text-muted-foreground">Customer reviews coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}

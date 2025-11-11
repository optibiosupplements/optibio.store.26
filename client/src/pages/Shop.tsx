import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductGallery from "@/components/ProductGallery";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Star, CheckCircle2, TrendingUp, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatPrice, calculateDiscountPrice } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Shop() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [sortBy, setSortBy] = useState("featured");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative py-12 md:py-16 overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-slate-300 hover:text-white">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-400">
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Shop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="max-w-3xl">
            <Badge className="mb-4 px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-0 shadow-gold">
              <span className="font-bold">Premium KSM-66® Formula</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Premium Ashwagandha Supplements
            </h1>
            <p className="text-lg text-slate-200">
              Clinically-researched KSM-66® formula backed by science. 
              Choose your perfect wellness solution.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <p className="text-sm text-muted-foreground">
                {products?.length || 0} {products?.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-2 border-yellow-100 hover:border-yellow-300 shadow-cream hover:shadow-gold transition-all bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
                <CardContent className="p-0">
                  {/* Product Gallery */}
                  <div className="relative p-4">
                    <ProductGallery
                      images={product.galleryImages ? JSON.parse(product.galleryImages) : [product.imageUrl || "/products/ashwagandha-bottle.jpg"]}
                      productName={product.name}
                    />
                    {product.isFeatured && (
                      <Badge className="absolute top-8 right-8 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-0 shadow-gold z-10">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Best Seller
                      </Badge>
                    )}
                    {product.compareAtPriceInCents && (
                      <Badge className="absolute top-8 left-8 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-0 shadow-gold z-10">
                        Save {Math.round((1 - product.priceInCents / product.compareAtPriceInCents) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>600mg KSM-66® per serving</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{product.servingsPerContainer} servings per bottle</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Third-party tested for purity</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-4 border-t">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(product.priceInCents)}
                        </span>
                        {product.compareAtPriceInCents && (
                          <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(product.compareAtPriceInCents)}
                          </span>
                        )}
                      </div>

                      {/* Subscription Savings */}
                      <div className="bg-secondary/10 border border-secondary/30 rounded-md p-3 mb-4">
                        <p className="text-sm font-semibold text-secondary-foreground mb-1">
                          💰 Subscribe & Save 15%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(calculateDiscountPrice(product.priceInCents, 15))} with subscription
                        </p>
                      </div>

                      {/* CTA Button */}
                      <Link href={`/product/${product.slug}`}>
                        <Button className="w-full" size="lg">
                          View Details
                        </Button>
                      </Link>
                    </div>

                    {/* Stock Indicator */}
                    {product.stockQuantity && product.stockQuantity <= (product.lowStockThreshold || 50) && (
                      <p className="text-xs text-destructive font-medium text-center">
                        Only {product.stockQuantity} left in stock!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {products?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Choose OptiBio?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">20+</div>
                <p className="font-semibold">Clinical Studies</p>
                <p className="text-sm text-muted-foreground">
                  Backed by peer-reviewed research
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <p className="font-semibold">Money-Back Guarantee</p>
                <p className="text-sm text-muted-foreground">
                  60 days to try risk-free
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">50K+</div>
                <p className="font-semibold">Happy Customers</p>
                <p className="text-sm text-muted-foreground">
                  Join our wellness community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

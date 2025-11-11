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
  TrendingUp
} from "lucide-react";
import { formatPrice } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();
  const mainProduct = products?.[0];

  const benefits = [
    {
      icon: Brain,
      title: "Supports Mental Clarity",
      description: "Clinically shown to support cognitive function and focus"
    },
    {
      icon: Moon,
      title: "Promotes Restful Sleep",
      description: "Helps support healthy sleep quality and duration"
    },
    {
      icon: Zap,
      title: "Boosts Energy Levels",
      description: "Supports natural energy and physical performance"
    },
    {
      icon: Heart,
      title: "Stress Management",
      description: "Helps the body adapt to stress naturally"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "I've tried many ashwagandha supplements, but OptiBio's KSM-66 is the only one that actually works. My stress levels are down and I'm sleeping better than ever!",
      verified: true
    },
    {
      name: "Michael R.",
      rating: 5,
      text: "As an athlete, recovery is everything. This supplement has noticeably improved my endurance and recovery time. Highly recommend!",
      verified: true
    },
    {
      name: "Jennifer L.",
      rating: 5,
      text: "The quality is outstanding. Love that it's third-party tested and made in the USA. Finally a supplement brand I can trust!",
      verified: true
    }
  ];

  const certifications = [
    { icon: Shield, text: "Third-Party Tested" },
    { icon: Award, text: "GMP Certified" },
    { icon: CheckCircle2, text: "Non-GMO" },
    { icon: TrendingUp, text: "20+ Clinical Studies" }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm font-semibold">
                  Clinically Researched KSM-66®
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Premium Ashwagandha for{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Stress-Free Living
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Backed by 20+ peer-reviewed studies. The gold standard in ashwagandha supplementation for stress management, sleep quality, and overall wellness.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/science">
                  <Button size="lg" variant="outline" className="text-lg px-8 w-full sm:w-auto">
                    View Clinical Studies
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                {certifications.map((cert, index) => {
                  const Icon = cert.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{cert.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Product Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/products/ashwagandha-bottle.jpg"
                  alt="OptiBio Ashwagandha KSM-66"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scientifically-Backed Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              KSM-66® is the most clinically studied ashwagandha extract, with research demonstrating significant benefits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Showcase with Pricing */}
      {mainProduct && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Start Your Wellness Journey Today
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose the plan that works best for you
                </p>
              </div>

              <Card className="border-2 border-primary/20 shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <img
                        src={mainProduct.imageUrl || "/products/ashwagandha-bottle.jpg"}
                        alt={mainProduct.name}
                        className="w-full max-w-sm mx-auto"
                      />
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{mainProduct.name}</h3>
                        <p className="text-muted-foreground">{mainProduct.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">
                            {formatPrice(mainProduct.priceInCents)}
                          </span>
                          {mainProduct.compareAtPriceInCents && (
                            <span className="text-xl text-muted-foreground line-through">
                              {formatPrice(mainProduct.compareAtPriceInCents)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {mainProduct.servingsPerContainer} servings • {mainProduct.servingSize}
                        </p>
                      </div>

                      <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                        <p className="text-sm font-semibold text-secondary-foreground mb-2">
                          💰 Save up to 25% with subscription
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Never run out. Cancel anytime.
                        </p>
                      </div>

                      <Link href="/shop">
                        <Button size="lg" className="w-full text-lg">
                          Shop Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>

                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>60-Day Money-Back Guarantee</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers are saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
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

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Wellness?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands who have discovered the power of premium KSM-66® Ashwagandha
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary" className="text-lg px-12">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm mt-6 opacity-75">
            Free shipping on orders over $75 • 60-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}

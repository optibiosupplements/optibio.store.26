import { Link } from "wouter";
import { APP_LOGO } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Truck, Award, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      {/* Trust Badges Bar */}
      <div className="border-b bg-background/50">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Shield className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Third-Party Tested</p>
              <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">Orders Over $75</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Award className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Made in USA</p>
              <p className="text-xs text-muted-foreground">GMP Certified</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Lock className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Secure Checkout</p>
              <p className="text-xs text-muted-foreground">256-bit SSL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <img src={APP_LOGO} alt="OptiBio" className="h-10 w-auto" />
            <p className="text-sm text-muted-foreground">
              Premium KSM-66® Ashwagandha backed by clinical research. 
              Supporting stress management and overall wellness naturally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    All Products
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?type=subscription">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Subscriptions
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/science">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Clinical Studies
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Shipping & Returns
                  </a>
                </Link>
              </li>
              <li>
                <a href="mailto:support@optibio.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/my-orders">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    My Account
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get exclusive offers and wellness tips
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OptiBio. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center md:text-left">
            *These statements have not been evaluated by the Food and Drug Administration. 
            This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}

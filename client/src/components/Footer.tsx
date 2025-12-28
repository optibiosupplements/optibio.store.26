import { Link } from "wouter";
import { APP_LOGO } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Truck, Award, Lock, Facebook, Instagram, Twitter, Accessibility } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      {/* Trust Badges Bar */}
      <div className="border-b bg-background/50">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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
            <Link href="/accessibility" className="flex flex-col items-center text-center space-y-2 hover:opacity-80 transition-opacity">
              <Accessibility className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">WCAG 2.1 AA</p>
              <p className="text-xs text-muted-foreground">Accessible Design</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            {/* Logo with NO background - consistent with header */}
            <div className="flex items-center space-x-2">
              <img src={APP_LOGO} alt="Optibio" className="h-12 w-auto" />
              <span className="text-lg font-bold text-foreground">Optibio<sup className="text-xs">®</sup> Supplements</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium KSM-66® Ashwagandha backed by clinical research. 
              Supporting stress management and overall wellness naturally.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com/optibio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow Optibio on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/optibio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow Optibio on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/optibio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow Optibio on Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?type=subscription" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/science" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Clinical Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <a href="mailto:support@optibio.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/my-orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Account
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
              © {new Date().getFullYear()} Optibio® Supplements. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Accessibility
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

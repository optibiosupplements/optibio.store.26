import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, Menu, X, User, Gift, Package, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_LOGO, getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { data: cartItems } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // P1 FIX: Reduced navigation items from 5 to 4 (Hick's Law - reduce choices)
  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Science", href: "/science" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-slate-100"
          : "bg-white/80 backdrop-blur-md border-b border-slate-100"
      }`}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Mobile Optimized for all screen sizes */}
          <Link href="/" className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 hover:opacity-90 transition-all group min-h-[44px]">
            {/* Logo with NO background - responsive scaling: 44px (320px), 52px (375px+), 65px (640px+) */}
            <img src={APP_LOGO} alt="Optibio" className="h-[44px] min-[375px]:h-[52px] sm:h-[65px] w-auto" />
            <div className="flex flex-col">
              {/* Unified typography - responsive text sizing */}
              <span className="text-base min-[375px]:text-lg sm:text-2xl font-bold leading-tight text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                Optibio<sup className="text-[10px]">®</sup> <span className="hidden sm:inline">Supplements</span>
              </span>
              <span className="text-[10px] xs:text-xs hidden sm:block text-muted-foreground">Science-Backed Wellness</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors text-[#1E3A5F] hover:text-[#1E3A5F]/80">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-sm font-medium">
                    <User className="h-5 w-5" />
                    <span>{user?.name || "Account"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/referral" className="flex items-center cursor-pointer">
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Refer & Earn</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      trpc.auth.logout.useMutation().mutate();
                      window.location.href = "/";
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a
                href={getLoginUrl()}
                className="hidden md:flex items-center space-x-2 text-sm font-medium transition-colors text-foreground/80 hover:text-foreground"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </a>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart - Mobile Optimized Touch Target */}
            <Link href="/cart" className="relative flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full transition-colors hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle - Enhanced Touch Target */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-11 w-11"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-2 mt-8">
                  {navigation.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent min-h-[44px] flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  {isAuthenticated ? (
                    <Link 
                      href="/my-orders"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent min-h-[44px] flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  ) : (
                    <a
                      href={getLoginUrl()}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent min-h-[44px] flex items-center"
                    >
                      Sign In
                    </a>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

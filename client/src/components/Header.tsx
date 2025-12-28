import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, Menu, X, User, Gift, Package, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_LOGO, getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
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
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-background"
      }`}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-all group min-h-[44px]">
            <div className="bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-md group-hover:shadow-lg transition-shadow">
              <img src={APP_LOGO} alt="OptiBio" className="h-[40px] sm:h-[50px] w-auto" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                OptiBio<sup className="text-xs">®</sup> <span className="hidden sm:inline text-base sm:text-lg font-semibold">Supplements</span>
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">Science-Backed Wellness</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
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
                className="hidden md:flex items-center space-x-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </a>
            )}

            {/* Cart - Mobile Optimized Touch Target */}
            <Link href="/cart" className="relative flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full hover:bg-accent transition-colors">
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

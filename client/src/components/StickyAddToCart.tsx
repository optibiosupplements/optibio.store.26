import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface StickyAddToCartProps {
  productId: number;
  productName: string;
  price: number;
  image: string;
  /**
   * Scroll threshold in pixels - when to show the sticky bar
   * Default: 800 (shows after scrolling past hero section)
   */
  threshold?: number;
}

/**
 * Sticky Add-to-Cart Bar
 * 
 * Appears after user scrolls past the hero section, providing
 * persistent access to add-to-cart functionality without scrolling back up.
 * 
 * Features:
 * - Quantity selector
 * - Real-time cart updates
 * - Smooth slide-in animation
 * - Mobile responsive
 * - Shows product image and price
 */
export default function StickyAddToCart({
  productId,
  productName,
  price,
  image,
  threshold = 800,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [, navigate] = useLocation();

  const utils = trpc.useUtils();
  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success(`Added ${quantity} ${quantity === 1 ? "bottle" : "bottles"} to cart`);
      utils.cart.get.invalidate();
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId,
      quantity,
      variantId: undefined,
    });
  };

  const handleBuyNow = () => {
    addToCartMutation.mutate(
      {
        productId,
        quantity,
        variantId: undefined,
      },
      {
        onSuccess: () => {
          navigate("/checkout");
        },
      }
    );
  };

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1E3A5F] border-t border-border dark:border-[#2D4A77] shadow-lg dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-slide-up transition-colors duration-300"
      style={{
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={image}
              alt={productName}
              className="w-12 h-12 object-cover rounded-md border border-border flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate text-slate-900 dark:text-white">{productName}</h3>
              <p className="text-sm text-muted-foreground dark:text-slate-300">
                ${price.toFixed(2)} / bottle
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium text-slate-900 dark:text-white">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
              disabled={quantity >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="hidden sm:flex"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={addToCartMutation.isPending}
              className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/90"
            >
              {addToCartMutation.isPending ? (
                "Adding..."
              ) : (
                <>
                  <span className="hidden sm:inline">Buy Now - </span>$
                  {(price * quantity).toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

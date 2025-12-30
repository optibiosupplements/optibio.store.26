import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Gift } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const STORAGE_KEY = "email_capture_dismissed";
const SHOW_DELAY_MS = 30000; // 30 seconds
const EXIT_THRESHOLD = 10; // pixels from top

export default function EmailCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasShown, setHasShown] = useState(false);

  const submitEmail = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data: { discountCode: string; message: string }) => {
      toast.success(`Success! Your discount code: ${data.discountCode}`);
      setIsOpen(false);
      localStorage.setItem(STORAGE_KEY, "true");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to subscribe");
    },
  });

  useEffect(() => {
    // Check if user has already dismissed or subscribed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      return;
    }

    // Timed trigger - show after 30 seconds
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, SHOW_DELAY_MS);

    // Exit-intent trigger - show when mouse leaves viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= EXIT_THRESHOLD && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        clearTimeout(timer);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    submitEmail.mutate({ email });
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md email-popup-modal dark:bg-gradient-to-br dark:from-[var(--optibio-abyssal)] dark:to-[var(--optibio-navy-card)] dark:border-[var(--optibio-border-dark)]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[var(--optibio-gold)]/10 dark:bg-[var(--optibio-luminous-gold)]/20 p-4 rounded-full">
              <Gift className="h-8 w-8 text-[var(--optibio-gold)] dark:text-[var(--optibio-luminous-gold)]" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl dark:text-white">
            Get 10% Off Your First Order
          </DialogTitle>
          <DialogDescription className="text-center dark:text-[var(--optibio-sky-grey)]">
            Join our wellness community and receive an exclusive discount code plus
            science-backed tips for better health.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-[var(--optibio-sky-grey)]">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-[var(--optibio-sky-grey)]" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 dark:bg-[var(--optibio-navy)] dark:border-[var(--optibio-border-dark)] dark:text-white dark:placeholder:text-[var(--optibio-sky-grey)] dark:focus:border-[var(--optibio-luminous-gold)] dark:focus:ring-[var(--optibio-luminous-gold)]/20"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--optibio-gold)] hover:bg-[var(--optibio-gold-dark)] text-white dark:bg-gradient-to-r dark:from-[var(--optibio-luminous-gold)] dark:to-[var(--optibio-luminous-gold)] dark:text-[var(--optibio-abyssal)] dark:hover:from-[var(--optibio-luminous-gold)] dark:hover:to-[var(--optibio-luminous-gold)] dark:font-bold btn-gold-cta"
            disabled={submitEmail.isPending}
          >
            {submitEmail.isPending ? "Subscribing..." : "Get My 10% Off Code"}
          </Button>

          <p className="text-xs text-center text-muted-foreground dark:text-[var(--optibio-sky-grey)]">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </form>

        <div className="flex items-center gap-4 pt-4 border-t dark:border-[var(--optibio-border-dark)]">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-[var(--optibio-navy)] dark:text-[var(--optibio-luminous-gold)]">20+</div>
            <div className="text-xs text-muted-foreground dark:text-[var(--optibio-sky-grey)]">Clinical Studies</div>
          </div>
          <div className="flex-1 text-center border-x dark:border-[var(--optibio-border-dark)]">
            <div className="text-2xl font-bold text-[var(--optibio-navy)] dark:text-[var(--optibio-luminous-gold)]">GMP</div>
            <div className="text-xs text-muted-foreground dark:text-[var(--optibio-sky-grey)]">Certified</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-[var(--optibio-navy)] dark:text-[var(--optibio-luminous-gold)]">Made</div>
            <div className="text-xs text-muted-foreground dark:text-[var(--optibio-sky-grey)]">In USA</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

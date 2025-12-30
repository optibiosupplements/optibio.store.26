import { trpc } from "@/lib/trpc";
import { Users } from "lucide-react";

interface SocialProofCounterProps {
  variant?: "banner" | "homepage";
}

export function SocialProofCounter({ variant = "homepage" }: SocialProofCounterProps) {
  // Get total reservation count from database
  const { data: stats } = trpc.presale.getStats.useQuery();
  
  // Start baseline at 500, add actual reservations
  const totalReservations = 500 + (stats?.totalReservations || 0);

  if (variant === "banner") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Users className="h-4 w-4" />
        <span className="font-semibold">{totalReservations.toLocaleString()}</span>
        <span className="hidden sm:inline">people reserved their spot</span>
        <span className="sm:hidden">reserved</span>
      </div>
    );
  }

  // Homepage variant - larger, more prominent
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F7F4EF] to-[#F7F4EF] px-6 py-3 border border-[#C9A961]/20">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C9A961]/10">
        <Users className="h-5 w-5 text-[#B89651]" />
      </div>
      <div className="text-left">
        <div className="text-2xl font-bold text-[#1E3A5F]">
          {totalReservations.toLocaleString()}
        </div>
        <div className="text-sm text-[#1E3A5F]">
          people joined the movement
        </div>
      </div>
    </div>
  );
}

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
    <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 px-6 py-3 border border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900">
        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="text-left">
        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
          {totalReservations.toLocaleString()}
        </div>
        <div className="text-sm text-emerald-700 dark:text-emerald-300">
          people joined the movement
        </div>
      </div>
    </div>
  );
}

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
    <div 
      className="inline-flex items-center gap-3 rounded-xl px-6 py-3 border transition-all duration-300 hover:shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        borderColor: '#BBF7D0',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)'
      }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)' }}>
        <Users className="h-5 w-5" style={{ color: '#16A34A' }} />
      </div>
      <div className="text-left">
        <div className="text-2xl font-bold" style={{ color: '#16A34A' }}>
          {totalReservations.toLocaleString()}
        </div>
        <div className="text-xs font-semibold uppercase" style={{ color: '#16A34A', letterSpacing: '0.5px' }}>
          people joined the movement
        </div>
      </div>
    </div>
  );
}

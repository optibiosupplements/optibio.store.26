import { Shield } from "lucide-react";

interface GuaranteeBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function GuaranteeBadge({ className = "", size = "md" }: GuaranteeBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg font-semibold text-green-800 shadow-sm ${sizeClasses[size]} ${className}`}
    >
      <Shield className={`${iconSizes[size]} text-green-600`} />
      <span>90-Day Money-Back Guarantee</span>
    </div>
  );
}

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for client load
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className="relative w-10 h-10 rounded-full opacity-0"
        aria-label="Toggle Night Clinic Mode"
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative overflow-hidden
        w-10 h-10 rounded-full 
        flex items-center justify-center
        transition-all duration-500 ease-out
        focus:outline-none focus:ring-2 focus:ring-[var(--optibio-gold)] focus:ring-offset-2
        ${isDark 
          ? "bg-slate-800/50 border border-slate-700 shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
          : "bg-white/80 border border-slate-200 shadow-sm hover:shadow-md"
        }
      `}
      aria-label="Toggle Night Clinic Mode"
      title={isDark ? "Switch to Day Mode" : "Switch to Night Clinic Mode"}
    >
      <div className="relative w-5 h-5">
        {/* SUN ICON (Day Mode) */}
        <Sun 
          className={`
            absolute inset-0 w-full h-full text-[var(--optibio-navy)]
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]
            ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
          `} 
        />
        
        {/* MOON ICON (Night Mode) - Gold filled */}
        <Moon 
          className={`
            absolute inset-0 w-full h-full text-[var(--optibio-luminous-gold)] fill-[var(--optibio-luminous-gold)]
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]
            ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
          `} 
        />
      </div>
      
      {/* Background Blur Effect (Backdrop) */}
      <div className="absolute inset-0 backdrop-blur-sm -z-10" />
      
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

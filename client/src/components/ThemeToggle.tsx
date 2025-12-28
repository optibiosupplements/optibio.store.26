import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for client load
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 opacity-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative w-10 h-10 rounded-full transition-all duration-500 ease-in-out overflow-hidden
        ${!isDark 
          ? 'bg-white/80 hover:bg-white border border-slate-200 text-opti-navy shadow-sm hover:shadow-md' 
          : 'bg-white/10 hover:bg-white/20 border border-white/10 text-opti-gold shadow-glow-gold'
        }
      `}
      title={!isDark ? "Switch to Midnight Mode" : "Switch to Day Mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon (Day Mode) */}
        <Sun 
          className={`
            absolute top-0 left-0 w-full h-full transition-all duration-500 transform
            ${!isDark 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
            }
          `} 
        />
        
        {/* Moon Icon (Night Mode) */}
        <Moon 
          className={`
            absolute top-0 left-0 w-full h-full transition-all duration-500 transform
            ${isDark 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
            }
          `} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

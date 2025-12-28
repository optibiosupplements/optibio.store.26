import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
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

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`
        relative w-10 h-10 rounded-full transition-all duration-500 ease-in-out
        ${theme === 'light' 
          ? 'bg-white/50 hover:bg-white border border-slate-200 text-[#1E3A5F] shadow-sm' 
          : 'bg-white/10 hover:bg-white/20 border border-white/10 text-[#C9A961] shadow-glow-gold'
        }
      `}
      title={theme === "light" ? "Switch to Midnight Mode" : "Switch to Day Mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon (Visible in Light Mode) */}
        <Sun 
          className={`
            absolute top-0 left-0 w-full h-full transition-all duration-500
            ${theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
            }
          `} 
        />
        
        {/* Moon Icon (Visible in Dark Mode) */}
        <Moon 
          className={`
            absolute top-0 left-0 w-full h-full transition-all duration-500
            ${theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
            }
          `} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

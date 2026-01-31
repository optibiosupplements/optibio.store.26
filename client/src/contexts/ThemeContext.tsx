import { createContext, useContext, useEffect, useState } from "react";

/**
 * 🔒 THEME SYSTEM - PRODUCTION LOCKED
 * 
 * ⚠️ CRITICAL RULES:
 * 1. Light Mode = Brand Default (NEVER CHANGES)
 * 2. Dark Mode = Optional User Preference Only
 * 3. NO system preference detection (light mode always default)
 * 4. Users can manually toggle to dark mode if desired
 * 
 * Last Updated: December 30, 2025
 * Status: PRODUCTION LOCKED
 * Authority: Brand Guidelines v1.0
 */

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  switchable?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "optibio-theme",
  switchable = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    
    // 🔒 LOCKED BEHAVIOR: Light mode is ALWAYS the default
    // Only respect localStorage if user explicitly toggled to dark mode
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    // ⚠️ REMOVED: System preference detection
    // Brand guideline: Light mode is the default, period.
    // Users can manually toggle to dark mode if they prefer.
    
    let initialTheme: Theme = defaultTheme; // Always "light" by default
    
    // Only use saved theme if user explicitly set it
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      initialTheme = savedTheme;
    }
    // NO system preference fallback - light mode is the brand default
    
    setThemeState(initialTheme);
    root.classList.remove("light", "dark");
    root.classList.add(initialTheme);
  }, [defaultTheme, storageKey]);

  // ⚠️ REMOVED: System preference listener
  // Brand guideline: Light mode is the default, no automatic switching.
  // Users must manually toggle to dark mode if they prefer it.
  // This ensures consistent brand experience for all users.

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  const value: ThemeProviderState = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  switchable?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "optibio-ui-theme",
  switchable = false,
  ...props
}: ThemeProviderProps) {
  // PERMANENT LOCK: OptiBio Light Mode Only
  // Light mode is locked as the official brand theme
  // No dark mode switching or system preference detection
  // This ensures consistent brand experience across all touchpoints
  // LOCKED: Always use light mode, ignore localStorage
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;

    // PERMANENT LOCK: Light mode only
    // OptiBio brand is locked to light mode for all users
    // This ensures consistent brand presentation across all devices and browsers
    root.classList.remove("light", "dark");
    root.classList.add("light");
  }, []);

  const value = {
    theme: "light" as const,
    setTheme: () => {
      // LOCKED: Theme cannot be changed
      // Light mode is permanent for OptiBio brand
      console.warn("OptiBio theme is locked to light mode");
    },
    toggleTheme: undefined,
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

# OptiBio Design System Report v3.0
## Comprehensive Brand & Theme Documentation

**Generated:** January 21, 2026  
**Purpose:** Design token verification before PR/social media campaign scaling

---

## 1. Global Design Tokens (CSS Variables)

### Source File: `client/src/index.css`

```css
@layer base {
  :root {
    /* Background & Foreground */
    --background: 0 0% 100%;           /* Pure white #FFFFFF */
    --foreground: 222.2 84% 4.9%;      /* Near black */
    
    /* Card Surfaces */
    --card: 0 0% 100%;                 /* White cards */
    --card-foreground: 222.2 84% 4.9%; /* Dark text on cards */
    
    /* Popover/Dropdown */
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    
    /* Primary Brand Color */
    --primary: 222.2 47.4% 11.2%;      /* Deep Navy #1E3A5F */
    --primary-foreground: 210 40% 98%; /* Light text on primary */
    
    /* Secondary */
    --secondary: 210 40% 96.1%;        /* Light gray */
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    /* Muted/Subtle */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    /* Accent */
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    /* Destructive/Error */
    --destructive: 0 84.2% 60.2%;      /* Red for errors */
    --destructive-foreground: 210 40% 98%;
    
    /* Borders & Inputs */
    --border: 214.3 31.8% 91.4%;       /* Light gray border */
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;            /* Focus ring */
    
    /* Border Radius */
    --radius: 0.5rem;                  /* 8px base radius */
    
    /* Sidebar (Admin) */
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    /* Dark Theme Background */
    --background: 222.2 84% 4.9%;      /* Deep navy/black */
    --foreground: 210 40% 98%;         /* Light text */
    
    /* Dark Card Surfaces */
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    /* Dark Popover */
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    /* Primary (inverted for dark) */
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    /* Secondary Dark */
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    /* Muted Dark */
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    /* Accent Dark */
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    /* Destructive Dark */
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    
    /* Borders Dark */
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    
    /* Sidebar Dark */
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

---

## 2. Brand Color Palette (Hardcoded Values)

### Primary Brand Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Deep Navy** | `#1E3A5F` | Headers, primary buttons, sidebar active state |
| **Navy Hover** | `#2C5282` | Button hover states |
| **Brand Gold** | `#C9A961` | Accents, icons, star ratings, trust badges |
| **Dark Gold** | `#D4AF37` | Dark theme gold variant |
| **Royal Blue CTA** | `#2563EB` | Primary CTA buttons |
| **Royal Blue Hover** | `#1D4ED8` | CTA hover state |
| **Alert Red** | `#DC2626` | Discount badges ONLY |

### Neutral Palette
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Charcoal** | `#2D2D2D` | Body text (light theme) |
| **Slate 900** | `#0f172a` | Dark backgrounds |
| **Slate 50** | `#f8fafc` | Admin background |
| **Muted Gray** | `#94A3B8` | Secondary text (dark theme) |

### Day Theme Gradient Background
```css
/* Hero section radial gradient */
background: radial-gradient(ellipse at top, #F8FCFE, #EBF5FB, #D6EAF8);
```

---

## 3. Day/Night Theme Toggle Implementation

### ThemeProvider Context: `client/src/contexts/ThemeContext.tsx`

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  switchable?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  switchable = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (!switchable) return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (switchable) localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      if (switchable) localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
```

### Current App.tsx Configuration
```tsx
<ThemeProvider defaultTheme="light">
  {/* App content */}
</ThemeProvider>
```

**Note:** Theme switching is currently **disabled** (`switchable` prop not set). To enable:
```tsx
<ThemeProvider defaultTheme="light" switchable>
```

---

## 4. Primary CTA Button Styling

### Standard CTA Button (BuyBox.tsx)
```tsx
<Button 
  size="lg" 
  className="w-full text-lg font-bold py-7 shadow-lg hover:shadow-xl 
             transition-all duration-300 hover:scale-[1.02] 
             bg-[#2563EB] hover:bg-[#1D4ED8] text-white 
             border-2 border-[#2563EB]"
>
  Pre-Order Now - Save {discount}%
  <ArrowRight className="ml-2 w-5 h-5" />
</Button>
```

### CTA Button Specifications
| Property | Value |
|----------|-------|
| Background | `#2563EB` (Royal Blue) |
| Hover Background | `#1D4ED8` |
| Text Color | White |
| Font Weight | Bold (`font-bold`) |
| Font Size | Large (`text-lg`) |
| Padding | `py-7` (28px vertical) |
| Border | 2px solid `#2563EB` |
| Border Radius | Inherited from Button component |
| Shadow | `shadow-lg` → `shadow-xl` on hover |
| Transform | `scale(1.02)` on hover |
| Transition | `300ms all` |

---

## 5. Product Card / BuyBox Component

### Card Container Styling
```tsx
<Card className="bg-white dark:bg-[#1E3A5F] 
                border-2 border-[#C9A961]/20 dark:border-[#2D4A77] 
                shadow-2xl rounded-3xl overflow-hidden">
```

### Product Image Container
```tsx
<div className="relative bg-gradient-to-br from-[#F7F4EF] to-white 
                dark:from-[#1E3A5F] dark:to-[#0B1120] 
                rounded-2xl p-8 shadow-lg">
```

### Price Display
```tsx
<span className="text-4xl sm:text-5xl font-bold 
                text-[#1E3A5F] dark:text-[#D4AF37]">
  {price}
</span>
```

### Discount Badge (Alert Red - ONLY for discounts)
```tsx
<Badge 
  className="text-white border-0 text-base font-bold px-4 py-1.5 shadow-md"
  style={{ backgroundColor: '#DC2626' }}
>
  Save {discount}%
</Badge>
```

### Trust Badge Icons
```tsx
<Shield className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
<Award className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
<CheckCircle2 className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
<TrendingUp className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
```

---

## 6. Admin Dashboard Styling

### Admin Color Scheme
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `bg-slate-50` | N/A (admin is light-only) |
| Sidebar | `bg-white` | N/A |
| Active Menu Item | `bg-[#1E3A5F] text-white` | N/A |
| Inactive Menu Item | `text-slate-600` | N/A |
| Card Border | `border-slate-200` | N/A |
| Header Text | `text-slate-900` | N/A |
| Muted Text | `text-slate-500` | N/A |

### Admin Welcome Banner
```tsx
<div className="p-4 rounded-lg bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] text-white">
```

### Admin Sign-In Button
```tsx
<Button className="w-full bg-[#1E3A5F] hover:bg-[#2C5282]">
  Sign In
</Button>
```

### Admin Metric Card Icons
```tsx
<DollarSign className="h-4 w-4 text-[#C9A961]" />  /* Revenue */
<Users className="h-4 w-4 text-[#1E3A5F]" />       /* Subscribers */
<TrendingUp className="h-4 w-4 text-green-600" />  /* Growth */
```

---

## 7. Typography System

### Font Family
```css
font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", 
             "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### Heading Hierarchy
| Level | Class | Usage |
|-------|-------|-------|
| H1 | `text-4xl sm:text-5xl font-bold` | Hero headlines |
| H2 | `text-xl font-semibold` | Section titles |
| H3 | `text-lg font-semibold` | Card titles |
| Body | `text-sm` | General content |
| Small | `text-xs` | Badges, captions |

---

## 8. Day Theme Specifications (Verified)

### Background Gradient
```css
/* Radial gradient for hero sections */
background: radial-gradient(ellipse at top, #F8FCFE, #EBF5FB, #D6EAF8);
```

### Text Colors
| Element | Color | Hex |
|---------|-------|-----|
| Headers | Deep Navy | `#1E3A5F` |
| Body Text | Charcoal | `#2D2D2D` |
| Muted Text | Slate Gray | `hsl(215.4 16.3% 46.9%)` |

### Surface Colors
| Surface | Color |
|---------|-------|
| Card Background | White `#FFFFFF` |
| Product Image BG | Gradient `#F7F4EF` → White |
| Admin Background | Slate 50 `#f8fafc` |

---

## 9. Night Theme Specifications (Verified)

### Background
```css
--background: 222.2 84% 4.9%;  /* Deep navy/black */
```

### Text Colors
| Element | Color |
|---------|-------|
| Primary Text | `hsl(210 40% 98%)` (near white) |
| Muted Text | `#94A3B8` |
| Gold Accents | `#D4AF37` |

### Surface Colors
| Surface | Color |
|---------|-------|
| Card Background | `#1E3A5F` (Deep Navy) |
| Product Image BG | Gradient `#1E3A5F` → `#0B1120` |
| Borders | `#2D4A77` |

---

## 10. Component Uniformity Checklist

### ✅ Verified Consistent
- [x] CTA buttons use Royal Blue `#2563EB`
- [x] Trust badge icons use Brand Gold `#C9A961`
- [x] Discount badges use Alert Red `#DC2626`
- [x] Headers use Deep Navy `#1E3A5F`
- [x] Dark theme gold uses `#D4AF37`
- [x] Admin sidebar uses consistent slate palette

### ⚠️ Recommendations
1. **Theme Switcher**: Currently disabled. Enable if day/night toggle is needed for users.
2. **Admin Dark Mode**: Admin dashboard is light-only. Consider adding dark mode support.
3. **Font Loading**: Consider adding Google Fonts (Inter/Roboto) for enhanced typography.

---

## 11. Design System Quick Reference

### Color Variables for Developers
```tsx
// Brand Colors (use these hardcoded values)
const COLORS = {
  deepNavy: '#1E3A5F',
  navyHover: '#2C5282',
  brandGold: '#C9A961',
  darkGold: '#D4AF37',
  royalBlue: '#2563EB',
  royalBlueHover: '#1D4ED8',
  alertRed: '#DC2626',
  charcoal: '#2D2D2D',
  mutedGray: '#94A3B8',
};

// Day Theme Gradient
const DAY_GRADIENT = 'radial-gradient(ellipse at top, #F8FCFE, #EBF5FB, #D6EAF8)';

// Night Theme Card BG
const NIGHT_CARD_BG = '#1E3A5F';
```

### Tailwind Class Patterns
```tsx
// Primary CTA Button
className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"

// Gold Icon
className="text-[#C9A961] dark:text-[#D4AF37]"

// Navy Header Text
className="text-[#1E3A5F] dark:text-white"

// Card Container
className="bg-white dark:bg-[#1E3A5F] border-2 border-[#C9A961]/20"
```

---

**Document Status:** Complete  
**Last Updated:** January 21, 2026  
**Version:** 3.0

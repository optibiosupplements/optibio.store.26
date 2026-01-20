import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Subscriptions from "./pages/Subscriptions";
import AdminAnalytics from "./pages/AdminAnalytics";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import About from "./pages/About";
import Science from "./pages/Science";
import FAQ from "./pages/FAQ";
import Quality from "./pages/Quality";
import Accessibility from "./pages/Accessibility";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Referral from "./pages/Referral";
import CartRecover from "./pages/CartRecover";
import Analytics from "./pages/Analytics";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

import PromoBanner from "./components/PromoBanner";
import EmailCaptureModal from "./components/EmailCaptureModal";
import SkipNav from "./components/SkipNav";
// import CrispChat from "./components/CrispChat"; // Removed - no website ID configured

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipNav />
      <PromoBanner />
      <Header />
      <main id="main-content" className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/cart/recover" component={CartRecover} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/order-success" component={OrderSuccess} />
          <Route path="/my-orders" component={MyOrders} />
          <Route path="/account/subscriptions" component={Subscriptions} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route path="/admin/revenue" component={Analytics} />
          <Route path="/admin/traffic" component={AnalyticsDashboard} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/shipping" component={Shipping} />
          <Route path="/about" component={About} />
          <Route path="/science" component={Science} />
          <Route path="/faq" component={FAQ} />
          <Route path="/quality" component={Quality} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/referral" component={Referral} />
          <Route path="/404" component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

/**
 * 🔒 THEME CONFIGURATION - PRODUCTION LOCKED
 * 
 * ⚠️ CRITICAL: defaultTheme="light" is PERMANENT
 * - Light mode = Brand default (80%+ of users)
 * - Dark mode = Optional user preference (manual toggle only)
 * - NO system preference detection
 * - DO NOT change defaultTheme without brand approval
 * 
 * See: COLORS_LOCKED.md for full documentation
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light" // 🔒 LOCKED: Brand default, never change
        switchable // Allows users to manually toggle to dark mode
      >
        <AnalyticsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <EmailCaptureModal />
            <CookieBanner />
          {/* <CrispChat websiteId="YOUR_WEBSITE_ID" /> */} {/* Removed - configure with real Crisp ID when ready */}
          </TooltipProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

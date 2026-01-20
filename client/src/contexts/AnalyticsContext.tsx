import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/analytics';

interface AnalyticsContextType {
  trackEvent: (eventType: string, metadata?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  // Track page views when location changes
  useEffect(() => {
    trackPageView(window.location.href);
  }, [location]);

  const trackEvent = (eventType: string, metadata?: Record<string, any>) => {
    console.log(`[Analytics] Event tracked: ${eventType}`, metadata);
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}

/**
 * Analytics Tracking Utility
 * Sends user interaction events to the backend for storage and analysis
 */

// We'll use fetch directly instead of tRPC hooks since these are standalone functions
// that need to work outside of React component context

export type EventType = 
  | 'page_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_started'
  | 'purchase_completed'
  | 'product_viewed'
  | 'search'
  | 'filter_applied';

export interface AnalyticsEvent {
  eventType: EventType;
  pageUrl: string;
  referrer?: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

// Generate or retrieve session ID
function getSessionId(): string {
  const key = 'optibio_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Export for use in other components
export { getSessionId };

// Get device type
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase())) {
    return 'mobile';
  }
  if (/ipad|android|tablet/i.test(ua.toLowerCase())) {
    return 'tablet';
  }
  return 'desktop';
}

// Export for use in other components
export { getDeviceType };

/**
 * Send event to backend via tRPC
 * Uses fetch directly to avoid React hook dependencies
 * Uses tRPC batch format for proper request handling
 */
async function sendToBackend(procedure: string, input: Record<string, any>): Promise<void> {
  try {
    const response = await fetch('/api/trpc/events.' + procedure + '?batch=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "0": { json: input } }),
    });
    
    if (!response.ok) {
      console.warn(`[Analytics] Backend returned ${response.status}`);
    }
  } catch (error) {
    // Silently fail - analytics should never break the user experience
    console.warn('[Analytics] Failed to send to backend:', error);
  }
}

/**
 * Track a page view event
 */
export async function trackPageView(pageUrl: string, metadata?: Record<string, any>) {
  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  
  // Log locally for debugging
  console.log('[Analytics] Page view:', pageUrl);
  
  // Send to backend
  await sendToBackend('pageView', {
    sessionId,
    pagePath: pageUrl,
    pageTitle: document.title,
    referrer: document.referrer || undefined,
    userAgent: navigator.userAgent,
    deviceType,
  });
}

/**
 * Track an add-to-cart event
 */
export async function trackAddToCart(
  productId: number, 
  productName: string,
  variantId: number | undefined, 
  quantity: number, 
  priceInCents: number
) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Add to cart:', { productId, productName, quantity });
  
  await sendToBackend('addToCart', {
    sessionId,
    productId,
    productName,
    variantId,
    quantity,
    priceInCents,
    pagePath: window.location.pathname,
  });
}

/**
 * Track checkout started event
 */
export async function trackCheckoutStarted(cartTotal: number, itemCount: number) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Checkout started:', { cartTotal, itemCount });
  
  await sendToBackend('checkoutStarted', {
    sessionId,
    cartTotal,
    itemCount,
    pagePath: window.location.pathname,
  });
}

/**
 * Track purchase completed event
 */
export async function trackPurchaseCompleted(orderId: number, orderTotal: number, itemCount: number) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Purchase completed:', { orderId, orderTotal, itemCount });
  
  await sendToBackend('purchaseCompleted', {
    sessionId,
    orderId,
    orderTotal,
    itemCount,
    pagePath: window.location.pathname,
  });
}

/**
 * Track product viewed event
 */
export async function trackProductViewed(productId: number, productName: string, price?: number) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Product viewed:', { productId, productName });
  
  await sendToBackend('productView', {
    sessionId,
    productId,
    productName,
    pagePath: window.location.pathname,
  });
}

/**
 * Track search event
 */
export async function trackSearch(searchQuery: string, resultsCount: number) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Search:', { searchQuery, resultsCount });
  
  await sendToBackend('search', {
    sessionId,
    searchQuery,
    resultsCount,
    pagePath: window.location.pathname,
  });
}

/**
 * Track filter applied event
 */
export async function trackFilterApplied(filterType: string, filterValue: string) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Filter applied:', { filterType, filterValue });
  
  await sendToBackend('filterApplied', {
    sessionId,
    filterType,
    filterValue,
    pagePath: window.location.pathname,
  });
}

/**
 * Track generic event
 */
export async function trackEvent(
  eventType: string, 
  eventCategory: string, 
  eventLabel?: string,
  eventData?: Record<string, any>
) {
  const sessionId = getSessionId();
  
  console.log('[Analytics] Event:', { eventType, eventCategory, eventLabel });
  
  await sendToBackend('track', {
    sessionId,
    eventType,
    eventCategory,
    eventLabel,
    pagePath: window.location.pathname,
    eventData: eventData ? JSON.stringify(eventData) : undefined,
  });
}

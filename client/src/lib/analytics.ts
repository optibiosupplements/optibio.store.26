import { trpc } from './trpc';

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

/**
 * Track a page view event
 */
export async function trackPageView(pageUrl: string, metadata?: Record<string, any>) {
  try {
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    
    console.log('[Analytics] Page view tracked:', { pageUrl, deviceType });
    
    // Send to backend (non-blocking)
    try {
      const response = await fetch('/api/trpc/events.pageView', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            sessionId,
            pagePath: pageUrl,
            pageTitle: document.title,
            deviceType,
          },
        }),
      });
      if (!response.ok) console.warn('[Analytics] Failed to send page view to backend');
    } catch (err) {
      console.warn('[Analytics] Could not send page view to backend:', err);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Track an add-to-cart event
 */
export async function trackAddToCart(productId: number, variantId: number, quantity: number, price: number) {
  try {
    const sessionId = getSessionId();
    
    console.log('[Analytics] Add to cart tracked:', { productId, variantId, quantity, price });
    
    // Send to backend (non-blocking)
    try {
      await fetch('/api/trpc/events.addToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            sessionId,
            productId,
            variantId,
            quantity,
            price,
            pagePath: window.location.href,
          },
        }),
      });
    } catch (err) {
      console.warn('[Analytics] Could not send add-to-cart to backend:', err);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track add to cart:', error);
  }
}

/**
 * Track checkout started event
 */
export async function trackCheckoutStarted(cartTotal: number, itemCount: number) {
  try {
    const sessionId = getSessionId();
    
    console.log('[Analytics] Checkout started tracked:', { cartTotal, itemCount });
    
    // Send to backend (non-blocking)
    try {
      await fetch('/api/trpc/events.checkoutStarted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            sessionId,
            cartTotal,
            itemCount,
            pagePath: window.location.href,
          },
        }),
      });
    } catch (err) {
      console.warn('[Analytics] Could not send checkout started to backend:', err);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track checkout started:', error);
  }
}

/**
 * Track purchase completed event
 */
export async function trackPurchaseCompleted(orderId: number, orderTotal: number, itemCount: number) {
  try {
    const sessionId = getSessionId();
    
    console.log('[Analytics] Purchase completed tracked:', { orderId, orderTotal, itemCount });
    
    // Send to backend (non-blocking)
    try {
      await fetch('/api/trpc/events.purchaseCompleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            sessionId,
            orderId,
            orderTotal,
            itemCount,
            pagePath: window.location.href,
          },
        }),
      });
    } catch (err) {
      console.warn('[Analytics] Could not send purchase completed to backend:', err);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track purchase completed:', error);
  }
}

/**
 * Track product viewed event
 */
export async function trackProductViewed(productId: number, productName: string, price: number) {
  try {
    const sessionId = getSessionId();
    
    console.log('[Analytics] Product viewed tracked:', { productId, productName, price });
    
    // Send to backend (non-blocking)
    try {
      await fetch('/api/trpc/events.productView', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            sessionId,
            productId,
            productName,
            productPrice: price,
            pagePath: window.location.href,
          },
        }),
      });
    } catch (err) {
      console.warn('[Analytics] Could not send product view to backend:', err);
    }
  } catch (error) {
    console.error('[Analytics] Failed to track product viewed:', error);
  }
}

/**
 * Track search event
 */
export async function trackSearch(searchQuery: string, resultsCount: number) {
  try {
    const event: AnalyticsEvent = {
      eventType: 'search',
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        searchQuery,
        resultsCount,
        deviceType: getDeviceType(),
      },
    };

    console.log('[Analytics] Search tracked:', event);
  } catch (error) {
    console.error('[Analytics] Failed to track search:', error);
  }
}

/**
 * Track filter applied event
 */
export async function trackFilterApplied(filterType: string, filterValue: string) {
  try {
    const event: AnalyticsEvent = {
      eventType: 'filter_applied',
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        filterType,
        filterValue,
        deviceType: getDeviceType(),
      },
    };

    console.log('[Analytics] Filter applied tracked:', event);
  } catch (error) {
    console.error('[Analytics] Failed to track filter applied:', error);
  }
}

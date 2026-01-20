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
    const event: AnalyticsEvent = {
      eventType: 'page_view',
      pageUrl,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        deviceType: getDeviceType(),
        ...metadata,
      },
    };

    // Send to analytics API (non-blocking)
    // In a real implementation, you'd batch these and send periodically
    console.log('[Analytics] Page view tracked:', event);
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Track an add-to-cart event
 */
export async function trackAddToCart(productId: number, variantId: number, quantity: number, price: number) {
  try {
    const event: AnalyticsEvent = {
      eventType: 'add_to_cart',
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        productId,
        variantId,
        quantity,
        price,
        deviceType: getDeviceType(),
      },
    };

    console.log('[Analytics] Add to cart tracked:', event);
  } catch (error) {
    console.error('[Analytics] Failed to track add to cart:', error);
  }
}

/**
 * Track checkout started event
 */
export async function trackCheckoutStarted(cartTotal: number, itemCount: number) {
  try {
    const event: AnalyticsEvent = {
      eventType: 'checkout_started',
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        cartTotal,
        itemCount,
        deviceType: getDeviceType(),
      },
    };

    console.log('[Analytics] Checkout started tracked:', event);
  } catch (error) {
    console.error('[Analytics] Failed to track checkout started:', error);
  }
}

/**
 * Track purchase completed event
 */
export async function trackPurchaseCompleted(orderId: number, orderTotal: number, itemCount: number) {
  try {
    const event: AnalyticsEvent = {
      eventType: 'purchase_completed',
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        orderId,
        orderTotal,
        itemCount,
        deviceType: getDeviceType(),
      },
    };

    console.log('[Analytics] Purchase completed tracked:', event);
  } catch (error) {
    console.error('[Analytics] Failed to track purchase completed:', error);
  }
}

/**
 * Track product viewed event
 */
export async function trackProductViewed(productId: number, productName: string, price: number) {
  try {
    const event: AnalyticsEvent = {
      eventType: 'product_viewed',
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      metadata: {
        productId,
        productName,
        price,
        deviceType: getDeviceType(),
      },
    };

    console.log('[Analytics] Product viewed tracked:', event);
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

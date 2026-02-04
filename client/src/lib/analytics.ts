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

// =============================================================================
// GA4 & META PIXEL E-COMMERCE TRACKING
// =============================================================================

/**
 * Track GA4 event
 */
function trackGA4(eventName: string, params: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
    console.log('[Analytics] GA4 event:', eventName, params);
  }
}

/**
 * Track Meta Pixel event
 */
function trackMetaPixel(eventName: string, params: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
    console.log('[Analytics] Meta Pixel event:', eventName, params);
  }
}

/**
 * Convert product to GA4 item format
 */
function toGA4Item(product: {
  id: number | string;
  name: string;
  priceInCents: number;
  quantity?: number;
  variant?: string;
  category?: string;
}) {
  return {
    item_id: String(product.id),
    item_name: product.name,
    item_category: product.category || 'Supplements',
    item_variant: product.variant,
    price: product.priceInCents / 100,
    quantity: product.quantity || 1,
  };
}

/**
 * Track product view - GA4 view_item + Meta ViewContent
 */
export function trackGA4ViewItem(product: {
  id: number | string;
  name: string;
  priceInCents: number;
  variant?: string;
  category?: string;
}) {
  const ga4Item = toGA4Item(product);
  
  trackGA4('view_item', {
    currency: 'USD',
    value: ga4Item.price,
    items: [ga4Item],
  });

  trackMetaPixel('ViewContent', {
    content_ids: [String(product.id)],
    content_type: 'product',
    value: ga4Item.price,
    currency: 'USD',
  });
}

/**
 * Track add to cart - GA4 add_to_cart + Meta AddToCart
 */
export function trackGA4AddToCart(product: {
  id: number | string;
  name: string;
  priceInCents: number;
  quantity: number;
  variant?: string;
  category?: string;
}) {
  const ga4Item = toGA4Item(product);
  const value = (product.priceInCents / 100) * product.quantity;

  trackGA4('add_to_cart', {
    currency: 'USD',
    value,
    items: [ga4Item],
  });

  trackMetaPixel('AddToCart', {
    content_ids: [String(product.id)],
    content_type: 'product',
    contents: [{
      id: String(product.id),
      quantity: product.quantity,
      item_price: product.priceInCents / 100,
    }],
    value,
    currency: 'USD',
  });
}

/**
 * Track begin checkout - GA4 begin_checkout + Meta InitiateCheckout
 */
export function trackGA4BeginCheckout(cart: {
  items: Array<{
    id: number | string;
    name: string;
    priceInCents: number;
    quantity: number;
    variant?: string;
  }>;
  totalInCents: number;
  coupon?: string;
}) {
  const ga4Items = cart.items.map(item => toGA4Item(item));
  const value = cart.totalInCents / 100;

  trackGA4('begin_checkout', {
    currency: 'USD',
    value,
    items: ga4Items,
    coupon: cart.coupon,
  });

  trackMetaPixel('InitiateCheckout', {
    content_ids: cart.items.map(item => String(item.id)),
    content_type: 'product',
    contents: cart.items.map(item => ({
      id: String(item.id),
      quantity: item.quantity,
      item_price: item.priceInCents / 100,
    })),
    value,
    currency: 'USD',
    num_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  });
}

/**
 * Track purchase - GA4 purchase + Meta Purchase
 */
export function trackGA4Purchase(order: {
  orderId: string;
  items: Array<{
    id: number | string;
    name: string;
    priceInCents: number;
    quantity: number;
    variant?: string;
  }>;
  totalInCents: number;
  shippingInCents?: number;
  taxInCents?: number;
  coupon?: string;
}) {
  const ga4Items = order.items.map(item => toGA4Item(item));
  const value = order.totalInCents / 100;

  trackGA4('purchase', {
    transaction_id: order.orderId,
    currency: 'USD',
    value,
    items: ga4Items,
    shipping: order.shippingInCents ? order.shippingInCents / 100 : 0,
    tax: order.taxInCents ? order.taxInCents / 100 : 0,
    coupon: order.coupon,
  });

  trackMetaPixel('Purchase', {
    content_ids: order.items.map(item => String(item.id)),
    content_type: 'product',
    contents: order.items.map(item => ({
      id: String(item.id),
      quantity: item.quantity,
      item_price: item.priceInCents / 100,
    })),
    value,
    currency: 'USD',
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
  });
}

/**
 * Track newsletter/lead signup - GA4 sign_up + Meta Lead
 */
export function trackGA4Lead(method: string = 'email') {
  trackGA4('sign_up', { method });
  trackMetaPixel('Lead', {});
}

/**
 * UTM Parameter Capture and Storage Utility
 * 
 * Captures UTM parameters from URL on landing and stores them in sessionStorage.
 * These are then passed to the checkout process for marketing attribution.
 */

export interface UTMParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  landingPage: string | null;
  referrer: string | null;
}

const UTM_STORAGE_KEY = 'optibio_utm_params';

/**
 * Capture UTM parameters from the current URL and store them.
 * Should be called once on initial page load.
 */
export function captureUTMParams(): void {
  // Only capture if we haven't already captured for this session
  const existing = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (existing) {
    return; // Already captured for this session
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  const utmParams: UTMParams = {
    utmSource: urlParams.get('utm_source'),
    utmMedium: urlParams.get('utm_medium'),
    utmCampaign: urlParams.get('utm_campaign'),
    utmTerm: urlParams.get('utm_term'),
    utmContent: urlParams.get('utm_content'),
    landingPage: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
  };

  // Only store if at least one UTM param is present, or we have a referrer
  const hasUTM = utmParams.utmSource || utmParams.utmMedium || utmParams.utmCampaign;
  const hasReferrer = utmParams.referrer && !utmParams.referrer.includes(window.location.hostname);
  
  if (hasUTM || hasReferrer) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    console.log('[UTM] Captured marketing attribution:', utmParams);
  } else {
    // Store minimal data for direct traffic
    const directParams: UTMParams = {
      utmSource: 'direct',
      utmMedium: 'none',
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      landingPage: window.location.pathname,
      referrer: null,
    };
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(directParams));
    console.log('[UTM] Direct traffic recorded');
  }
}

/**
 * Retrieve stored UTM parameters.
 * Returns null if no UTM params have been captured.
 */
export function getUTMParams(): UTMParams | null {
  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) {
    return null;
  }
  
  try {
    return JSON.parse(stored) as UTMParams;
  } catch {
    return null;
  }
}

/**
 * Clear stored UTM parameters.
 * Typically called after a successful order to reset for next session.
 */
export function clearUTMParams(): void {
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}

/**
 * Get UTM params formatted for API submission.
 * Returns an object with only non-null values.
 */
export function getUTMParamsForAPI(): Partial<UTMParams> {
  const params = getUTMParams();
  if (!params) {
    return {};
  }

  // Filter out null values
  const result: Partial<UTMParams> = {};
  if (params.utmSource) result.utmSource = params.utmSource;
  if (params.utmMedium) result.utmMedium = params.utmMedium;
  if (params.utmCampaign) result.utmCampaign = params.utmCampaign;
  if (params.utmTerm) result.utmTerm = params.utmTerm;
  if (params.utmContent) result.utmContent = params.utmContent;
  if (params.landingPage) result.landingPage = params.landingPage;
  if (params.referrer) result.referrer = params.referrer;
  
  return result;
}

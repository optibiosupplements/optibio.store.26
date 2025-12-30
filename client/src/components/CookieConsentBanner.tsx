import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('optibio-cookie-consent');
    
    if (!consentChoice) {
      // Show banner only if no previous choice
      setIsVisible(true);
    } else if (consentChoice === 'accepted') {
      // Load GA4 if previously accepted
      loadGoogleAnalytics();
    }
    
    setIsLoading(false);
  }, []);

  const loadGoogleAnalytics = () => {
    // Inject GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BMT4HP6FX1';
    document.head.appendChild(script);

    // Initialize gtag
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    function gtag(...args: any[]) {
      w.dataLayer.push(arguments);
    }
    w.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-BMT4HP6FX1', {
      'anonymize_ip': true,
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false,
    });
  };

  const handleAccept = () => {
    localStorage.setItem('optibio-cookie-consent', 'accepted');
    localStorage.setItem('optibio-cookie-consent-date', new Date().toISOString());
    loadGoogleAnalytics();
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('optibio-cookie-consent', 'declined');
    localStorage.setItem('optibio-cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E3A5F] border-t-4 border-[#C9A961] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex-1">
            <p className="text-white text-sm sm:text-base font-medium mb-2">
              We use cookies to enhance your experience and analyze site traffic.
            </p>
            <p className="text-white/80 text-xs sm:text-sm">
              By clicking "Accept," you consent to our use of cookies for analytics and marketing purposes. 
              You can manage your preferences anytime.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            {/* Accept Button - Gold with Navy text */}
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-[#C9A961] text-[#1E3A5F] font-bold rounded-lg hover:bg-[#B89651] transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
              aria-label="Accept cookies"
            >
              Accept All
            </button>

            {/* Decline Button - Transparent with white border */}
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
              aria-label="Decline cookies"
            >
              Decline
            </button>

            {/* Close button */}
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-white/60 hover:text-white transition-colors"
              aria-label="Close cookie banner"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

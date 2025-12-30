import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem('optibio-cookie-consent');
    if (savedConsent) {
      setConsent(savedConsent as 'accepted' | 'declined');
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('optibio-cookie-consent', 'accepted');
    setConsent('accepted');
    setIsVisible(false);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
      (window as any).gtag('event', 'cookie_consent', {
        'consent_type': 'all_accepted',
        'timestamp': new Date().toISOString()
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('optibio-cookie-consent', 'declined');
    setConsent('declined');
    setIsVisible(false);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1E3A5F] border-t-4 border-[#C9A961] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] p-4 md:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            
            <div className="flex-1">
              <h3 className="text-white font-bold text-base md:text-lg mb-2">
                Clinical Transparency & Privacy
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed max-w-3xl">
                We use cookies to analyze clinical data performance and deliver a personalized 
                wellness experience. By clicking "Accept", you agree to our use of cookies 
                for analytics and site functionality. 
                <a href="/privacy" className="text-[#C9A961] hover:text-white underline ml-1 transition-colors">
                  Read our Privacy Policy.
                </a>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button 
                onClick={handleClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>

              <Button 
                onClick={handleDecline}
                variant="outline"
                className="px-4 md:px-6 py-2 md:py-3 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 bg-transparent transition-colors whitespace-nowrap"
              >
                Essential Only
              </Button>

              <Button 
                onClick={handleAccept}
                className="px-6 md:px-8 py-2 md:py-3 text-sm font-bold text-[#1E3A5F] bg-[#C9A961] rounded-lg hover:bg-[#B89850] shadow-lg transition-all transform hover:scale-105 whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SkipNav Component
 * 
 * Provides a "Skip to main content" link for keyboard users.
 * Hidden by default but becomes visible when focused via Tab key.
 * Improves accessibility by allowing users to bypass navigation.
 */

export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-[#1E3A5F] focus:text-white focus:rounded-lg focus:shadow-lg focus:ring-4 focus:ring-[#C9A961]/50 focus:font-semibold focus:transition-all"
    >
      Skip to main content
    </a>
  );
}

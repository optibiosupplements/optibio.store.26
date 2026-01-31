// HeroVariantA.tsx
// Variant A (Homepage Hero) — "Luxury Clinical"
// Requires TailwindCSS. Uses Sora for headings + Inter for body if available, but will fall back safely.

import React from "react";

function IconBeaker(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 3h6M10 3v5l-5.5 9.5A3 3 0 0 0 7.1 22h9.8a3 3 0 0 0 2.6-4.5L14 8V3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 14h7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.8 1.8L15.8 9.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLeaf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 4c-7 1-12.5 6.5-13.5 13.5C13.5 18.5 19 13 20 6V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 20c5-2 8-5 10-10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTruck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 7h11v10H3V7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 10h4l3 3v4h-7v-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6 11h12v10H6V11z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGuarantee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.7 1.7 3.3-3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroVariantA() {
  // =========
  // SETTINGS
  // =========

  // Use the existing working hero bottle image in your project:
  const PRODUCT_IMAGE_SRC = "/bottlemockbluegold_beigebg.png";

  // Homepage CTA destination:
  const CTA_HREF = "/shop";

  // FIX #1: Hardcoded prices - NO dynamic math rounding
  const ORIGINAL_PRICE = 69.99;
  const NORMAL_PRICE = 37.79;
  const PREORDER_PRICE = 28.35; // HARDCODED - not computed

  // Social proof (keep only claims you're comfortable with)
  const RATING = "4.9/5";
  const HAPPY_CUSTOMERS = "5,247";
  const SOCIAL_TREND_LINE = "Popular this week";

  return (
    <section className="w-full">
      {/* Background */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #F8FCFE 0%, #EBF5FB 45%, #D6EAF8 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            {/* LEFT: Copy + Offer */}
            <div className="space-y-5">
              {/* Top pill */}
              <div className="inline-flex items-center rounded-full border border-[#C9A961]/35 bg-[#0F2A44] px-5 py-2 text-[11px] font-semibold tracking-[0.16em] text-white shadow-sm">
                SCIENCE-BACKED&nbsp;&nbsp;•&nbsp;&nbsp;THIRD-PARTY TESTED
              </div>

              {/* FIX #2: Headline - Locked typography (Sora, weight 800, letter-spacing -0.03em, line-height 0.95) */}
              <h1
                className="text-[#132B4C] [font-family:Sora,ui-sans-serif,system-ui]"
                style={{ 
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  fontStyle: "normal", 
                  transform: "none" 
                }}
              >
                <span className="block text-5xl sm:text-6xl">Feel calm again.</span>
                <span className="block text-5xl sm:text-6xl">Think clearly,</span>
                <span className="block text-5xl sm:text-6xl">Sleep deeply.</span>
              </h1>

              {/* Subheadline */}
              <p className="max-w-xl text-[16px] leading-7 text-[#2D2D2D] [font-family:Inter,ui-sans-serif,system-ui]">
                Clinically studied ashwagandha for stress support, better sleep, and clearer focus —
                one capsule daily.
              </p>

              {/* FIX #3: Proof row - Tighter spacing (gap-4 instead of gap-6) */}
              <div className="flex flex-wrap items-center gap-4 text-[#1E3A5F]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A961]/35 bg-white/70 text-[#C9A961]">
                    <IconBeaker className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold [font-family:Inter,ui-sans-serif,system-ui]">
                      Clinically studied extract
                    </div>
                    <div className="text-xs text-[#1E3A5F]/70 [font-family:Inter,ui-sans-serif,system-ui]">
                      Transparent sourcing
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A961]/35 bg-white/70 text-[#C9A961]">
                    <IconShield className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold [font-family:Inter,ui-sans-serif,system-ui]">
                      3rd-party tested
                    </div>
                    <div className="text-xs text-[#1E3A5F]/70 [font-family:Inter,ui-sans-serif,system-ui]">
                      COA-backed quality
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A961]/35 bg-white/70 text-[#C9A961]">
                    <IconLeaf className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold [font-family:Inter,ui-sans-serif,system-ui]">
                      Non-GMO &amp; Organic
                    </div>
                    <div className="text-xs text-[#1E3A5F]/70 [font-family:Inter,ui-sans-serif,system-ui]">
                      Clean label
                    </div>
                  </div>
                </div>
              </div>

              {/* FIX #4: Offer Card - Reduced vertical padding (~10-15% less) */}
              <div className="max-w-xl rounded-[22px] border border-[#C9A961]/30 bg-white/80 shadow-[0_16px_50px_rgba(15,42,68,0.12)] backdrop-blur">
                <div className="p-5 sm:p-6">
                  {/* "No timer" strip - tighter */}
                  <div className="rounded-[14px] border border-[#FECACA] bg-gradient-to-r from-[#FEF2F2] to-[#FFF7ED] px-4 py-3">
                    <div className="text-sm font-semibold text-[#7C2D12] [font-family:Inter,ui-sans-serif,system-ui]">
                      Limited pre-order pricing ends soon
                    </div>
                  </div>

                  {/* Price stack - tighter */}
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-end gap-3">
                      <div className="text-[52px] font-extrabold leading-none text-[#132B4C] [font-family:Sora,ui-sans-serif,system-ui]">
                        ${PREORDER_PRICE.toFixed(2)}
                      </div>
                      <div className="pb-1">
                        <div className="text-base text-[#94A3B8] line-through [font-family:Inter,ui-sans-serif,system-ui]">
                          ${ORIGINAL_PRICE.toFixed(2)}
                        </div>
                        <div className="text-xs text-[#64748B] [font-family:Inter,ui-sans-serif,system-ui]">
                          Normal: ${NORMAL_PRICE.toFixed(2)} (46% off)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-[#DC2626] px-3 py-1 text-xs font-bold tracking-wide text-white">
                        PRE-ORDER PRICE
                      </span>
                    </div>
                  </div>

                  {/* Micro breakdown line - tighter */}
                  <div className="mt-2 text-sm text-[#334155] [font-family:Inter,ui-sans-serif,system-ui]">
                    Includes: <span className="font-semibold">46% off</span> +{" "}
                    <span className="font-semibold">extra 25% pre-order savings</span>
                  </div>

                  {/* Pre-order ship line - tighter */}
                  <div className="mt-3 flex items-center gap-2 text-[14px] [font-family:Inter,ui-sans-serif,system-ui]">
                    <span className="text-[#C9A961]">✦</span>
                    <span className="font-semibold text-[#1E3A5F]">Pre-Order Special:</span>
                    <span className="text-[#1E3A5F]/85">Ships Feb 14–21, 2026</span>
                  </div>

                  {/* Free shipping bar - tighter */}
                  <div className="mt-3 rounded-[12px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-[#7C2D12] [font-family:Inter,ui-sans-serif,system-ui]">
                      <IconTruck className="h-4 w-4 text-[#C9A961]" />
                      <span className="font-semibold">Free shipping on orders $75+</span>
                    </div>
                  </div>

                  {/* FIX #5: CTA - Adjusted hierarchy (slightly lighter weight, arrow more prominent) */}
                  <a
                    href={CTA_HREF}
                    className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#2563EB] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.30)] transition hover:brightness-95 [font-family:Inter,ui-sans-serif,system-ui]"
                  >
                    <span>Pre-Order Now — Only ${PREORDER_PRICE.toFixed(2)}/bottle</span>
                    <span aria-hidden className="text-2xl font-light">
                      →
                    </span>
                  </a>

                  {/* Trust micro row - tighter */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#E2E8F0] pt-3 text-xs text-[#475569] [font-family:Inter,ui-sans-serif,system-ui]">
                    <div className="flex items-center gap-1.5">
                      <IconLock className="h-3.5 w-3.5" />
                      Secure checkout
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconGuarantee className="h-3.5 w-3.5" />
                      90-day guarantee
                    </div>
                  </div>
                </div>
              </div>

              {/* FIX #6: Social proof - Reduced prominence (lighter bg, less padding, smaller shadow) */}
              <div className="max-w-xl rounded-[18px] border border-[#BBF7D0]/60 bg-[#F0FDF4]/70 p-4 shadow-[0_8px_25px_rgba(15,42,68,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Avatars */}
                    <div className="flex -space-x-2.5">
                      {[
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=60",
                        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=64&q=60",
                        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=64&q=60",
                        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=64&q=60",
                      ].map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt=""
                          className="h-9 w-9 rounded-full border-2 border-[#F0FDF4] object-cover"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#C9A961]" aria-label="5 stars">
                        {"★★★★★".split("").map((s, i) => (
                          <span key={i} className="text-base leading-none">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm font-bold text-[#132B4C] [font-family:Inter,ui-sans-serif,system-ui]">
                        {RATING}
                      </div>
                    </div>

                    <div className="mt-0.5 text-[14px] font-semibold text-[#132B4C] [font-family:Inter,ui-sans-serif,system-ui]">
                      {HAPPY_CUSTOMERS} happy customers
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#16A34A] [font-family:Inter,ui-sans-serif,system-ui]">
                      <span>✓</span>
                      {SOCIAL_TREND_LINE}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FIX #7: RIGHT: Product card - Raised bottle, reduced padding */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px]">
                <div className="rounded-[24px] border border-[#C9A961]/35 bg-white/85 p-4 shadow-[0_24px_60px_rgba(15,42,68,0.16)] backdrop-blur">
                  <div className="flex items-center justify-center">
                    <img
                      src={PRODUCT_IMAGE_SRC}
                      alt="OptiBio Ashwagandha KSM-66 bottle"
                      className="h-[380px] w-auto drop-shadow-[0_24px_35px_rgba(0,0,0,0.22)] -mt-4"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Subtle glow */}
                <div
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] opacity-50 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(201,169,97,0.20) 0%, rgba(37,99,235,0.08) 35%, rgba(214,234,248,0.00) 70%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

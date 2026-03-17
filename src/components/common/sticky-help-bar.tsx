"use client";

import { useEffect, useState } from "react";
import { openLeadModal } from "./lead-modal";

export function StickyHelpBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past ~100vh (the hero)
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary py-2.5 px-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-3 text-sm shadow-lg transition-transform duration-300"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
    >
      <span className="text-white text-xs sm:text-sm text-center">
        <strong className="font-bold">Need Help?</strong>{" "}
        <span className="text-white/85">Call us:</span>{" "}
        <a href="tel:08045579576" className="text-white font-medium hover:underline underline-offset-2 whitespace-nowrap">
          080-4557-9576
        </a>
      </span>
      <span className="text-white/40 hidden sm:inline">or</span>
      <button
        onClick={() => openLeadModal("sticky-bar")}
        className="hidden sm:inline-flex items-center gap-1 text-white font-bold tracking-wider uppercase text-xs hover:underline underline-offset-2"
      >
        Request Callback
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

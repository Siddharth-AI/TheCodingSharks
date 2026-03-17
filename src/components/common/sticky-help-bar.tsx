export function StickyHelpBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary py-3 px-4 flex items-center justify-center gap-2 sm:gap-3 text-sm shadow-lg">
      <span className="text-white">
        <strong className="font-bold">Need Help?</strong>{" "}
        <span className="text-white/85">Talk to us at</span>{" "}
        <a href="tel:08045579576" className="text-white font-medium hover:underline underline-offset-2">
          08045579576
        </a>
      </span>
      <span className="text-white/40 hidden sm:inline">or</span>
      <a
        href="/contact"
        className="hidden sm:inline-flex items-center gap-1 text-white font-bold tracking-wider uppercase text-xs hover:underline underline-offset-2"
      >
        Request Callback
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}

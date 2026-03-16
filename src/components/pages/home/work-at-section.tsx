import { Container } from "@/components/layout/container";

export function WorkAtSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-14 sm:py-16 md:py-20 border-t border-white/5">
      {/* Subtle top glow from the light section above */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-orange-50/5 to-transparent" />

      {/* Heading */}
      <Container>
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white/30 uppercase mb-3">
            Where Our Alumni Work
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white font-heading tracking-tight">
            Our Alumni Work At
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-white/40 max-w-lg">
            Our graduates are building products at India's top startups, unicorns, and global tech companies.
          </p>
        </div>
      </Container>

      {/* Row 1 — right to left */}
      <div
        className="marquee-pause relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="flex animate-marquee-left w-max">
          <img
            src="/images/workat1.webp"
            alt="Companies our alumni work at"
            className="h-10 sm:h-12 md:h-14 w-auto select-none"
            draggable={false}
          />
          <img
            src="/images/workat1.webp"
            alt=""
            aria-hidden="true"
            className="h-10 sm:h-12 md:h-14 w-auto select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Gap */}
      <div className="h-4 sm:h-5" />

      {/* Row 2 — left to right */}
      <div
        className="marquee-pause relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="flex animate-marquee-right w-max">
          <img
            src="/images/workat2.webp"
            alt="More companies our alumni work at"
            className="h-10 sm:h-12 md:h-14 w-auto select-none"
            draggable={false}
          />
          <img
            src="/images/workat2.webp"
            alt=""
            aria-hidden="true"
            className="h-10 sm:h-12 md:h-14 w-auto select-none"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}

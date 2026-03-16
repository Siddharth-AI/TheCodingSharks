import { Container } from "@/components/layout/container";

export function WhyCodingSharksSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#fff7ee] via-[#fffbf7] to-white">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />
      <Container>
        {/* Heading */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 font-heading tracking-tight mb-10 sm:mb-14">
          Why CodingSharks?
        </h2>

        {/* ── Desktop Grid (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:auto-rows-[130px] gap-4 xl:gap-5">

          {/* Col 1 | Rows 1–3 — Large text card */}
          <div className="col-start-1 row-start-1 row-span-3 rounded-2xl border border-gray-200 bg-white p-5 overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3 leading-snug">
                India's Tech Job Market Reality, 2025
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600 list-disc list-inside leading-relaxed">
                <li>70% of CS graduates fail their first technical interview</li>
                <li>Companies want engineers who build products, not just pass tests</li>
                <li>Project-based developers hired 3× faster than degree-only applicants</li>
                <li>Only 12% of engineering graduates are directly employable</li>
                <li>Bootcamp-trained engineers start contributing from week one — no re-training needed</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-primary">CS</div>
              <div>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Source:</span> LinkedIn India Tech Report 2025
                </p>
              </div>
            </div>
          </div>

          {/* Col 1 | Rows 4–5 — Image */}
          <div className="col-start-1 row-start-4 row-span-2 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80"
              alt="Student coding"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Col 1 | Row 6 — Bottom decorative: pink at top, white at bottom (bottom line invisible) */}
          <div className="col-start-1 row-start-6 row-span-1 rounded-t-2xl overflow-hidden bg-linear-to-b from-orange-100 to-white" />

          {/* Col 2 | Row 1 — Top decorative: white at top (invisible), pink at bottom */}
          <div className="col-start-2 row-start-1 row-span-1 rounded-b-2xl overflow-hidden bg-linear-to-b from-white to-orange-100" />

          {/* Col 2 | Rows 2–3 — Big stat */}
          <div className="col-start-2 row-start-2 row-span-2 rounded-2xl bg-primary p-5 flex flex-col justify-center shadow-md">
            <p className="text-5xl xl:text-6xl font-extrabold text-white leading-none font-heading">87%</p>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">
              of our students land their first tech role within 6 months of graduating
            </p>
          </div>

          {/* Col 2 | Rows 4–6 — Text card */}
          <div className="col-start-2 row-start-4 row-span-3 rounded-2xl border border-gray-200 bg-white p-5 overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3 leading-snug">
                The CodingSharks Learning Model
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600 list-disc list-inside leading-relaxed">
                <li>Ship 10+ real full-stack products from day one</li>
                <li>Weekly 1-on-1 mentor sessions with senior engineers</li>
                <li>Live code reviews and architecture walkthroughs</li>
                <li>Mock interviews with DSA + system design sprints</li>
                <li>61% of our students came from non-CS backgrounds</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-primary">CS</div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Source:</span> CodingSharks Internal Data
              </p>
            </div>
          </div>

          {/* Col 3 | Rows 1–3 — Text card */}
          <div className="col-start-3 row-start-1 row-span-3 rounded-2xl border border-gray-200 bg-white p-5 overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3 leading-snug">
                What Top Tech Companies Actually Hire For
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600 list-disc list-inside leading-relaxed">
                <li>Engineers who can build and deploy end-to-end, independently</li>
                <li>Full-stack proficiency over textbook theoretical knowledge</li>
                <li>System design and scalable architecture thinking</li>
                <li>AI & automation integration in everyday workflows</li>
                <li>Companies skip traditional filters for strong portfolio candidates</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-500">GD</div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Source:</span> Glassdoor India Tech Hiring 2025
              </p>
            </div>
          </div>

          {/* Col 3 | Rows 4–5 — Image */}
          <div className="col-start-3 row-start-4 row-span-2 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
              alt="Technology and circuits"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Col 3 | Row 6 — Bottom decorative: pink at top, white at bottom (bottom line invisible) */}
          <div className="col-start-3 row-start-6 row-span-1 rounded-t-2xl overflow-hidden bg-linear-to-b from-orange-100 to-white" />

          {/* Col 4 | Row 1 — Top pink card: white at top (invisible), pink at bottom, with label */}
          <div className="col-start-4 row-start-1 row-span-1 rounded-b-2xl overflow-hidden bg-linear-to-b from-white to-orange-100 flex items-end px-5 pb-2.5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-400">Outcomes 2025</p>
          </div>

          {/* Col 4 | Rows 2–4 — Text card */}
          <div className="col-start-4 row-start-2 row-span-3 rounded-2xl border border-gray-200 bg-white p-5 overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3 leading-snug">
                CodingSharks Placement Outcomes
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600 list-disc list-inside leading-relaxed">
                <li>Average package: ₹8–15 LPA for fresh graduates</li>
                <li>Top package achieved: ₹40 LPA+</li>
                <li>1,200+ verified hiring partners across India</li>
                <li>15,000+ careers transformed since 2021</li>
                <li>Alumni placed at Reliance, PayPal, Nykaa & more</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-primary">CS</div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Source:</span> CodingSharks Placement Report 2025
              </p>
            </div>
          </div>

          {/* Col 4 | Rows 5–6 — Big stat */}
          <div className="col-start-4 row-start-5 row-span-2 rounded-2xl bg-primary p-5 flex flex-col justify-center shadow-md">
            <p className="text-4xl xl:text-5xl font-extrabold text-white leading-none font-heading">₹40L+</p>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">
              Top package achieved by a CodingSharks graduate — 2025
            </p>
          </div>

        </div>

        {/* ── Mobile / Tablet Grid (< lg) ── */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Stat 1 */}
          <div className="rounded-2xl bg-primary p-6 shadow-md">
            <p className="text-5xl font-extrabold text-white leading-none font-heading">87%</p>
            <p className="text-sm text-white/80 mt-2">of students land their first tech role within 6 months</p>
          </div>

          {/* Stat 2 */}
          <div className="rounded-2xl bg-primary p-6 shadow-md">
            <p className="text-5xl font-extrabold text-white leading-none font-heading">₹40L+</p>
            <p className="text-sm text-white/80 mt-2">Top package achieved by a CodingSharks graduate</p>
          </div>

          {/* Text 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-3">India's Tech Job Market Reality</p>
            <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside leading-relaxed">
              <li>70% of CS graduates fail their first technical interview</li>
              <li>Only 12% of engineering graduates are directly employable</li>
              <li>Project-based developers hired 3× faster</li>
            </ul>
          </div>

          {/* Text 2 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-3">The CodingSharks Learning Model</p>
            <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside leading-relaxed">
              <li>10+ real full-stack products from day one</li>
              <li>1-on-1 mentorship from senior engineers</li>
              <li>Mock interviews + DSA sprints</li>
            </ul>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-48 sm:h-56">
            <img
              src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80"
              alt="Student coding"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text 3 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-3">CodingSharks Placement Outcomes</p>
            <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside leading-relaxed">
              <li>1,200+ verified hiring partners</li>
              <li>15,000+ careers transformed since 2021</li>
              <li>Alumni at Reliance, PayPal, Nykaa & more</li>
            </ul>
          </div>

        </div>
      </Container>
    </section>
  );
}

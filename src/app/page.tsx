import { AlumniWorkSection } from "@/components/pages/home/alumni-work-section"
import { CoursesMarqueeSection } from "@/components/pages/home/courses-marquee-section"
import { HeroSection } from "@/components/pages/home/hero-section"
import { BookLiveClassSection } from "@/components/pages/home/book-live-class-section"
import { SupportersSection } from "@/components/pages/home/supporters-section"

export default function HomePage() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <picture className="absolute top-0 left-0 right-0 h-[55vh]">
          <source
            media="(min-width: 768px)"
            srcSet="/images/grid/ezgif_285019e9218540c3_9ef0acb83f.webp"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/grid/ezgif_81a45f823f76635f_54311c2d8a.webp"
          />
          <img
            src="/images/grid/ezgif_81a45f823f76635f_54311c2d8a.webp"
            alt=""
            className="h-full w-full object-cover object-top opacity-90"
          />
        </picture>
      </div>
      <HeroSection />
      <BookLiveClassSection />
      <CoursesMarqueeSection />
      <AlumniWorkSection />
      <SupportersSection />
    </>
  )
}

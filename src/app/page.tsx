import { HeroSection } from "@/components/pages/home/hero-section";
import { BookLiveClassSection } from "@/components/pages/home/book-live-class-section";
import { WorkAtSection } from "@/components/pages/home/work-at-section";
import { WhyCodingSharksSection } from "@/components/pages/home/why-codingsharks-section";
import { CoursesSection } from "@/components/pages/home/courses-section";
import { PlacementStoriesSection } from "@/components/pages/home/placement-stories-section";
import { ReviewsSection } from "@/components/pages/home/reviews-section";
import { CommunitySection } from "@/components/pages/home/community-section";
import { MentorsSection } from "@/components/pages/home/mentors-section";
import { HowToApplySection } from "@/components/pages/home/how-to-apply-section";
import { CourseShowcaseCard } from "@/components/pages/home/course-showcase-section";
import { ComparisonSection } from "@/components/pages/home/comparison-section";
import { FaqSection } from "@/components/pages/home/faq-section";
import { FinalCtaSection } from "@/components/pages/home/final-cta-section";

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
      <CourseShowcaseCard index={0} />
      <WorkAtSection />
      <WhyCodingSharksSection />
      <CourseShowcaseCard index={1} />
      <CoursesSection />
      <PlacementStoriesSection />
      <CourseShowcaseCard index={2} />
      <ReviewsSection />
      <CommunitySection />
      <MentorsSection />
      <HowToApplySection />
      <ComparisonSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}

import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function CoursesMarqueeSection() {
  return (
    <Section className="border-t border-border/70 py-2 sm:py-4">
      <Container className="max-w-full">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-background to-transparent" />

          <div className="flex w-max items-center gap-0 animate-marquee-left motion-reduce:animate-none">
            <Image
              src="/images/companiesLogo.png"
              alt="Company logos"
              width={3523}
              height={135}
              className="h-11 w-auto opacity-70 grayscale sm:h-12"
              priority={false}
            />
            <Image
              src="/images/companiesLogo.png"
              alt=""
              width={3523}
              height={135}
              className="h-11 w-auto opacity-70 grayscale sm:h-12"
              priority={false}
              aria-hidden="true"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

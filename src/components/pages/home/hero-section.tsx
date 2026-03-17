"use client";

import home from "@/data/home.json";
import { ArrowRight, Download, Code2, Terminal, Blocks } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { openLeadModal } from "@/components/common/lead-modal";

const styles = `
@keyframes fade-slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
.animate-fade-slide-1 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
.animate-fade-slide-2 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
.animate-fade-slide-3 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
.animate-fade-slide-4 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
.animate-fade-slide-5 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
.float-icon { animation: float 6s ease-in-out infinite; }
`;

export function HeroSection() {
  const { hero } = home;
  // @ts-ignore
  const secondaryCta = hero.secondaryCta;

  return (
    <Section className="relative overflow-hidden min-h-svh flex flex-col justify-center bg-transparent pt-20 sm:pt-18 md:pt-28">
      <style>{styles}</style>

      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent opacity-60 z-[-1]" />
        <picture className="absolute bottom-0 left-0 right-0 h-[80%] z-[-2] opacity-60 mix-blend-screen pointer-events-none filter sepia-[.3] hue-rotate-[30deg] saturate-[1] brightness-[0.8] contrast-[1.2]">
          <source media="(min-width: 768px)" srcSet="/images/grid/ezgif_270f8b43f0c78a4f_d69c27d649.webp" />
          <source media="(max-width: 767px)" srcSet="/images/grid/ezgif_44a84ca6bc9243bf_29cf504620.webp" />
          <img src="/images/grid/ezgif_44a84ca6bc9243bf_29cf504620.webp" alt="" className="w-full h-full object-cover object-bottom" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-orange-300/10" />
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute hidden lg:flex top-[15%] left-[10%] float-icon text-white/5 pointer-events-none">
        <Code2 size={64} strokeWidth={1} className="text-primary/20" />
      </div>
      <div className="absolute hidden lg:flex top-[50%] right-[8%] float-icon text-white/5 pointer-events-none" style={{ animationDelay: "1.5s" }}>
        <Terminal size={56} strokeWidth={1} className="text-primary/20" />
      </div>
      <div className="absolute hidden sm:flex bottom-[5%] left-[20%] float-icon text-white/5 pointer-events-none" style={{ animationDelay: "3s" }}>
        <Blocks size={72} strokeWidth={1} className="text-primary/10" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="flex flex-col items-center text-center px-2 sm:px-0">
          {/* Main Headline */}
          <h1 className="animate-fade-slide-2 max-w-sm sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl text-balance font-medium tracking-tight font-heading">
            <span className="text-white block sm:whitespace-nowrap text-[28px] sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] leading-[1.15] sm:leading-[1.1]">
              {hero.headline1} <span>{hero.headline2}</span>
            </span>
            <span className="inline-flex items-center justify-center gap-2 sm:gap-4 text-primary italic font-heading opacity-90 relative mt-2 sm:mt-4 md:mt-4">
              <span className="hidden sm:inline-block w-8 sm:w-12 h-0.5 bg-primary/50 relative"></span>
              <span className="relative z-10 inline-block text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-normal leading-none">
                {hero.headline3.split("—")[1]?.trim() || "Not Just Learn Coding"}
                <span className="pointer-events-none absolute -bottom-4 sm:-bottom-5 md:-bottom-10 left-1/2 -translate-x-1/2 w-full sm:w-[110%] lg:w-[120%] text-primary opacity-90 drop-shadow-lg">
                  <svg width="100%" height="auto" viewBox="4 -38 289 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M107.08 23.2866C105.326 23.6687 103.583 24.0715 101.851 24.4968C101.22 24.6514 100.843 25.2395 101.008 25.8097L101.016 25.8321C91.598 26.1941 82.1832 26.6376 72.7744 27.1648C59.1827 27.9268 45.51 28.9835 31.9777 30.4502C18.6045 31.8996 14.9094 32.2781 3.42068 34.4551C3.09213 34.5173 2.45633 34.5283 2.11588 34.6229C1.79212 34.7127 1.56191 34.8616 1.41494 35.0056C1.22666 35.1882 1.12024 35.3959 1.07765 35.6216C1.03273 35.8675 1.05286 36.1663 1.29043 36.4951C1.96055 37.418 3.02105 37.6515 4.30521 37.4244C5.41011 37.2289 6.73868 36.5951 7.787 36.5023C25.2386 34.9588 42.6762 33.2908 60.13 31.7702C86.8499 29.4426 113.505 28.0252 140.171 26.9335C168.218 26.5182 196.264 26.8003 224.273 27.7271C242.515 28.33 260.727 29.4273 278.951 30.335C278.939 30.408 278.938 30.4839 278.943 30.5612C278.993 31.1497 279.563 31.586 280.212 31.5354C280.87 31.4839 286.742 31.1983 287.821 30.9314C288.439 30.7785 288.675 30.4256 288.752 30.2749C288.964 29.862 288.968 29.4184 288.474 29.0066C288.376 28.9276 288.194 28.7976 287.863 28.7196C287.58 28.6509 286.879 28.5719 285.608 28.5135C265.199 27.5588 244.808 26.2644 224.38 25.5874C215.26 25.2868 206.136 25.0527 197.006 24.891C209.386 24.4627 221.771 24.0146 234.173 23.489C234.708 23.4678 234.965 23.3831 235.013 23.3635C235.689 23.0811 235.728 22.5918 235.71 22.3154C235.704 22.2167 235.598 21.4037 234.596 21.3121C234.01 21.2581 229.782 21.2238 228.155 21.1827C220.335 20.9789 220.519 21.0348 212.52 20.8874C194.932 20.5653 177.373 20.4849 159.769 20.4978C152.751 20.5032 145.733 20.5389 138.714 20.6079C158.909 18.5844 179.552 18.1769 199.22 17.5354C209.366 17.2047 219.516 16.9313 229.666 16.8183C234.212 16.7679 238.758 16.7866 243.304 16.7568C244.716 16.7474 246.125 16.768 247.536 16.7663C247.703 16.7659 249.892 16.7323 250.251 16.717C251.19 16.677 251.393 15.9127 251.401 15.8821C251.439 15.7383 251.576 14.7131 250.405 14.5821C233.491 12.6894 215.811 13.627 198.762 13.6452C168.921 13.6768 139.015 14.4995 109.202 16.0211C96.0159 16.6939 82.8791 17.7695 69.7183 18.8417C63.1454 19.3773 56.5554 19.9363 50.0552 21.0257C49.4031 21.1352 47.923 21.2661 47.2063 21.3946C46.8416 21.4602 46.5827 21.5564 46.4646 21.6207C45.9468 21.9 45.8498 22.2956 45.8463 22.5716C45.8448 22.7783 45.9063 23.5048 46.9869 23.7025C62.428 26.5317 79.4632 24.094 95.0833 23.6169C99.0818 23.4947 103.079 23.3849 107.08 23.2866ZM120.107 23.008C115.485 23.7562 110.911 24.6236 106.404 25.6344C117.648 25.2394 128.895 24.9604 140.149 24.794C158.705 24.0343 177.264 23.4318 195.845 22.7902C183.821 22.6638 171.795 22.629 159.75 22.6381C146.539 22.6478 133.322 22.7659 120.107 23.008ZM184.324 15.8619C159.315 16.0998 134.282 16.8833 109.316 18.1575C96.153 18.8293 83.044 19.903 69.9088 20.9732C64.7402 21.3943 59.5578 21.8285 54.4207 22.5309C67.7472 23.7126 81.8919 21.8791 95.0251 21.4781C103.319 21.2248 111.619 21.0236 119.916 20.8713C140.961 17.4867 162.991 16.545 184.324 15.8619Z" fill="currentColor"></path>
                  </svg>
                </span>
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <div className="animate-fade-slide-3 mt-8 sm:mt-14 md:mt-18 max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-5xl">
            <p className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed font-sans">
              {hero.subheadline}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-slide-5 mt-8 sm:mt-10 md:mt-16 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-center w-full sm:w-auto">
            <button
              onClick={() => openLeadModal("hero-primary")}
              className="group h-12 sm:h-13 md:h-14 w-full sm:w-auto rounded-full bg-primary px-7 sm:px-9 text-sm sm:text-base font-semibold text-white shadow-[0_4px_24px_rgba(255,107,44,0.35)] hover:shadow-[0_6px_32px_rgba(255,107,44,0.45)] hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <span>{hero.primaryCta.label}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {secondaryCta && (
              <button
                onClick={() => openLeadModal("hero-secondary")}
                className="group h-12 sm:h-13 md:h-14 w-full sm:w-auto rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-7 sm:px-9 text-sm sm:text-base font-medium text-white/80 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4 opacity-60" />
                <span>{secondaryCta.label}</span>
              </button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

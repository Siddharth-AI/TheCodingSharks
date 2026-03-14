"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import nav from "@/data/nav.json";
import site from "@/data/site.json";
import codingLogo from "@/assets/images/Coding.png";

import { ButtonLink } from "@/components/common/button-link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 py-2 sm:py-3 md:py-4 w-full transition-all duration-300">
      <Container>
        {/* Pill navbar — shrinks height on mobile, expands on desktop */}
        <div className="relative mx-auto flex h-12 sm:h-14 md:h-16 w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#0a0a0a]/60 px-4 sm:px-6 md:px-8 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] supports-[backdrop-filter]:bg-[#0a0a0a]/40 before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:border before:border-white/5 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-20 flex-shrink-0">
          
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 group transition-transform duration-300 hover:scale-105 shrink-0"
          >
            <Image
              src={codingLogo}
              alt={site.brand.name}
              width={120}
              height={40}
              className="h-18 sm:h-22 md:h-22 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="relative z-10 hidden flex-1 items-center justify-center gap-1 md:flex lg:gap-2">
            {nav.header.links.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group text-xs lg:text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                    active
                      ? "text-foreground drop-shadow-[0_0_8px_rgba(255,107,44,0.5)] bg-primary/80 px-3 py-1.5 rounded-full border border-primary/10"
                      : "text-white/70 hover:text-white px-2.5 py-1.5 lg:px-3"
                  }`}
                >
                  {item.label}
                  {!active && (
                    <span className="absolute left-2.5 right-2.5 lg:left-3 lg:right-3 -bottom-1 h-[2px] bg-primary transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="relative z-10 hidden items-center md:flex shrink-0 ml-2 lg:ml-4">
            <ButtonLink
              href={nav.header.primaryCta.href}
              className="group relative h-8 sm:h-9 md:h-10 overflow-hidden rounded-full bg-primary px-4 lg:px-6 text-xs lg:text-sm font-bold text-white shadow-[0_0_20px_-5px_#ff6b2c] transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_#ff6b2c] hover:bg-[#ff7b42]"
            >
              <span className="relative z-10">{nav.header.primaryCta.label}</span>
              <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2.5s_infinite]"></div>
            </ButtonLink>
          </div>

          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger
              className="relative z-10 ml-auto md:hidden"
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 sm:size-9 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Menu className="size-4 sm:size-5" aria-hidden="true" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />

            <SheetContent
              side="right"
              className="border-white/10 bg-[#0a0a0a]/95 text-white backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/80 w-[280px] sm:w-[320px]"
            >
              <SheetHeader className="border-b border-white/10 pb-4">
                <SheetTitle className="text-left">
                  <Image
                    src={codingLogo}
                    alt={site.brand.name}
                    width={100}
                    height={34}
                    className="h-7 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 pt-6">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary/80 px-4">
                    Navigate
                  </p>
                  <div className="flex flex-col gap-1">
                    {nav.header.links.map((item) => {
                      const active =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="px-0">
                  <ButtonLink
                    href={nav.header.primaryCta.href}
                    className="h-11 w-full rounded-full justify-center bg-primary px-6 text-sm font-bold text-white shadow-[0_0_20px_-5px_#ff6b2c] hover:bg-[#ff7b42] transition-colors"
                  >
                    {nav.header.primaryCta.label}
                  </ButtonLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

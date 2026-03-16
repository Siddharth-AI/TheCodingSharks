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
    <header className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-3 md:py-4 w-full transition-all duration-300">
      <Container>
        {/* Pill navbar */}
        <div className="relative mx-auto flex h-12 sm:h-14 md:h-14 w-full max-w-7xl items-center justify-between rounded-full border border-white/8 bg-[#0a0a0a]/40 px-4 sm:px-6 md:px-8 backdrop-blur-xl shadow-[0_2px_16px_rgb(0,0,0,0.2)] flex-shrink-0">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 group transition-transform duration-300 hover:scale-105 shrink-0">
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
                  className={`relative group text-xs lg:text-sm font-medium transition-all duration-300 px-2.5 py-1.5 lg:px-3 ${
                    active
                      ? "text-white"
                      : "text-white/55 hover:text-white/90"
                  }`}>
                  {item.label}
                  <span className={`absolute left-2.5 right-2.5 lg:left-3 lg:right-3 -bottom-0.5 h-0.5 bg-primary/70 rounded-full transition-transform duration-300 origin-left ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="relative z-10 hidden items-center md:flex shrink-0 ml-2 lg:ml-4">
            <ButtonLink
              href={nav.header.primaryCta.href}
              className="h-8 sm:h-9 md:h-10 rounded-full bg-primary/90 px-4 lg:px-6 text-xs lg:text-sm font-semibold text-white transition-all hover:bg-primary">
              {nav.header.primaryCta.label}
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
                  className="size-8 sm:size-9 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                  <Menu className="size-4 sm:size-5" aria-hidden="true" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />

            <SheetContent
              side="right"
              className="border-white/10 bg-[#0a0a0a]/95 text-white backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/80 w-[280px] sm:w-[320px]">
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
                          }`}>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="px-0">
                  <ButtonLink
                    href={nav.header.primaryCta.href}
                    className="h-11 w-full rounded-full justify-center bg-primary px-6 text-sm font-bold text-white shadow-[0_0_20px_-5px_#ff6b2c] hover:bg-[#ff7b42] transition-colors">
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

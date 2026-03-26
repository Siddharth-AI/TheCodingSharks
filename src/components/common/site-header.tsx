"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

import nav from "@/data/nav.json";
import site from "@/data/site.json";
import codingLogo from "@/assets/images/Coding.png";

import { Container } from "@/components/layout/container";
import { openLeadModal } from "@/components/common/lead-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

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
            <button
              onClick={() => openLeadModal("navbar")}
              className="h-8 sm:h-9 md:h-10 rounded-full bg-primary/90 px-4 lg:px-6 text-xs lg:text-sm font-semibold text-white transition-all hover:bg-primary">
              Free Demo Session
            </button>
          </div>

          {/* Mobile Hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="relative z-10 ml-auto md:hidden"
              render={
                <button
                  className="size-8 sm:size-9 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center">
                  {open
                    ? <X className="size-4 sm:size-5" />
                    : <Menu className="size-4 sm:size-5" />
                  }
                  <span className="sr-only">Toggle menu</span>
                </button>
              }
            />

            <SheetContent
              side="right"
              className="border-l border-white/10 bg-[#0a0a0a] text-white w-[300px] sm:w-[340px] p-0 flex flex-col">

              {/* Header */}
              <SheetHeader className="px-5 pt-5 pb-4 border-b border-white/8 flex-row items-center justify-between">
                <SheetTitle>
                  <Image
                    src={codingLogo}
                    alt={site.brand.name}
                    width={100}
                    height={34}
                    className="h-7 w-auto"
                  />
                </SheetTitle>
                <button
                  onClick={closeMenu}
                  className="size-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="size-4" />
                </button>
              </SheetHeader>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-3 mb-3">
                  Menu
                </p>
                {nav.header.links.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                        active
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-white/65 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                      }`}>
                      {item.label}
                      <ChevronRight className={`size-3.5 transition-colors ${active ? "text-primary" : "text-white/20"}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="px-5 py-5 border-t border-white/8">
                <button
                  onClick={() => {
                    closeMenu();
                    openLeadModal("navbar-mobile");
                  }}
                  className="h-12 w-full bg-primary text-white text-sm font-bold tracking-wide shadow-[0_0_24px_-4px_#ff6b2c] hover:bg-[#ff7b42] transition-colors flex items-center justify-center gap-2">
                  Free Demo Session
                  <ChevronRight className="size-4" />
                </button>
                <p className="text-[10px] text-white/25 text-center mt-3">
                  100% free · No commitment required
                </p>
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

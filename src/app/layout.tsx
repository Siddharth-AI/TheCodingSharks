import type { Metadata } from "next"
import { Manrope, Space_Grotesk } from "next/font/google"

import "react-toastify/dist/ReactToastify.css"

import "./globals.css"

import { SiteFooter } from "@/components/common/site-footer"
import { SiteHeader } from "@/components/common/site-header"
import { AppToaster } from "@/components/common/toaster"

// Body / UI font — Manrope (clean, modern sans-serif)
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

// Heading font — Space Grotesk (geometric, techy, impactful)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Coding Sharks — Learn Coding. Get Placed.",
    template: "%s — Coding Sharks",
  },
  description:
    "Learn Web, App, DSA, ML, DevOps and Cloud with global instructors and placement-focused mentoring.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} font-sans min-h-dvh bg-background text-foreground antialiased`}
      >
        <SiteHeader />
        <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        <SiteFooter />
        <AppToaster />
      </body>
    </html>
  )
}


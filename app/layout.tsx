import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import type { Metadata } from "next"

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Warung Mama Nia",
  description: "Sistem kasir Warung Mama Nia untuk mengelola transaksi dan operasional toko.",
  icons: {
    icon: "/logo warung.png",
    shortcut: "/logo warung.png",
    apple: "/logo warung.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html
        lang="id"
        suppressHydrationWarning
        className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
      >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

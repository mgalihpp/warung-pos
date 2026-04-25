import { Geist, Geist_Mono } from "next/font/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next"
import { uploadRouter } from "@/app/api/uploadthing/core"

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

export const viewport: Viewport = {
  maximumScale: 1,
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
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Warung Mama Nia POS",
    short_name: "Mama Nia POS",
    description:
      "Sistem kasir Warung Mama Nia untuk mengelola transaksi dan operasional toko.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#18181b",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/logo%20warung.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}

"use client"

import { useState, useSyncExternalStore } from "react"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  CashierIcon,
  ChartHistogramIcon,
  DashboardSquare01Icon,
  InvoiceIcon,
  Menu01Icon,
  PackageIcon,
  ShoppingCart01Icon,
  Store01Icon,
  TagsIcon,
} from "@hugeicons/core-free-icons"

import { useSession } from "@/lib/auth-client"
import { AdminMobileSidebar } from "./admin-mobile-sidebar"

type PosMobileTab = "barang" | "keranjang" | "pembayaran"

type MobileHeaderConfig = {
  title: string
  icon?: typeof DashboardSquare01Icon
}

const posMobileTabs = ["barang", "keranjang", "pembayaran"] as const

const adminMobileHeaders = [
  { href: "/admin/barang", title: "Barang", icon: PackageIcon },
  { href: "/admin/kategori", title: "Kategori", icon: TagsIcon },
  { href: "/admin/transaksi", title: "Transaksi", icon: InvoiceIcon },
  { href: "/admin/laporan", title: "Laporan", icon: ChartHistogramIcon },
  { href: "/admin/pos", title: "Kasir", icon: CashierIcon },
] satisfies Array<MobileHeaderConfig & { href: string }>

function getPosMobileTabSnapshot(): PosMobileTab {
  const tab = document.body.dataset.posMobileTab

  return posMobileTabs.includes(tab as PosMobileTab) ? (tab as PosMobileTab) : "barang"
}

function subscribePosMobileTab(onStoreChange: () => void) {
  window.addEventListener("pos-mobile-tab-change", onStoreChange)

  return () => window.removeEventListener("pos-mobile-tab-change", onStoreChange)
}

function getPengaturanDetailSnapshot(): string | null {
  return document.body.dataset.pengaturanDetailTitle ?? null
}

function subscribePengaturanDetail(onStoreChange: () => void) {
  window.addEventListener("pengaturan-detail-change", onStoreChange)

  return () => window.removeEventListener("pengaturan-detail-change", onStoreChange)
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const posMobileTab = useSyncExternalStore<PosMobileTab>(
    subscribePosMobileTab,
    getPosMobileTabSnapshot,
    () => "barang"
  )
  const pengaturanDetailTitle = useSyncExternalStore(
    subscribePengaturanDetail,
    getPengaturanDetailSnapshot,
    () => null
  )

  const userName = session?.user?.name ?? "Admin"
  const userEmail = session?.user?.email ?? undefined
  const userRole = session?.user?.role ?? "admin"

  const posMobileHeaders: Record<PosMobileTab, MobileHeaderConfig> = {
    barang: { title: "Warung Mama Nia", icon: Store01Icon },
    keranjang: { title: "Checkout", icon: ShoppingCart01Icon },
    pembayaran: { title: "Pembayaran", icon: InvoiceIcon },
  }

  const isPosPage = pathname === "/admin/pos"
  const isPengaturanPage = pathname.startsWith("/admin/pengaturan")
  const isPengaturanDetail = isPengaturanPage && !!pengaturanDetailTitle
  const isPengaturanSubPage = isPengaturanPage && pathname !== "/admin/pengaturan"
  const isPosSubStep = isPosPage && posMobileTab !== "barang"
  const activeAdminHeader = adminMobileHeaders.find((item) => pathname.startsWith(item.href))

  const pengaturanHeader: MobileHeaderConfig = pathname.startsWith("/admin/pengaturan/tambah-akun")
    ? { title: "Tambah Akun" }
    : pathname.startsWith("/admin/pengaturan/akun")
      ? { title: "Manajemen Akun" }
      : pathname.startsWith("/admin/pengaturan/tema")
        ? { title: "Tema Tampilan" }
      : { title: pengaturanDetailTitle ?? "Pengaturan" }

  const mobileHeader: MobileHeaderConfig = isPosPage
    ? posMobileHeaders[posMobileTab]
    : isPengaturanPage
      ? pengaturanHeader
      : activeAdminHeader
        ? { title: activeAdminHeader.title }
        : { title: "Dashboard" }

  const handleMobileHeaderAction = () => {
    if (isPengaturanDetail) {
      window.dispatchEvent(new Event("pengaturan-detail-back"))
      return
    }

    if (isPengaturanSubPage) {
      router.push("/admin/pengaturan")
      return
    }

    if (isPosSubStep) {
      window.dispatchEvent(new CustomEvent("pos-mobile-tab-request", {
        detail: { tab: posMobileTab === "pembayaran" ? "keranjang" : "barang" },
      }))
      return
    }

    setIsMobileSidebarOpen(true)
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <header className="shrink-0 bg-primary px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleMobileHeaderAction}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/15"
          >
            <HugeiconsIcon icon={isPengaturanDetail || isPengaturanSubPage || isPosSubStep ? ArrowLeft01Icon : Menu01Icon} size={20} />
          </button>

          <div className="flex items-center gap-2">
            {mobileHeader.icon ? (
              <HugeiconsIcon icon={mobileHeader.icon} size={20} className="text-primary-foreground" />
            ) : null}
            <span className="text-base font-bold text-primary-foreground">{mobileHeader.title}</span>
          </div>

          <div className="w-8" />
        </div>
      </header>

      <main className="flex flex-1 min-h-0 flex-col overflow-hidden">{children}</main>

      <AdminMobileSidebar
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
        user={{ name: userName, email: userEmail, role: userRole }}
      />
    </div>
  )
}

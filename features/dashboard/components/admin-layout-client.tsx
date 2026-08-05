"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
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
  PlusSignIcon,
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
  { href: "/admin/barang", title: "Manajemen Barang", icon: PackageIcon },
  { href: "/admin/kategori", title: "Kategori", icon: TagsIcon },
  { href: "/admin/transaksi", title: "Transaksi", icon: InvoiceIcon },
  { href: "/admin/laporan", title: "Laporan", icon: ChartHistogramIcon },
  { href: "/admin/pos", title: "Kasir", icon: CashierIcon },
] satisfies Array<MobileHeaderConfig & { href: string }>

function getPosMobileTabSnapshot(): PosMobileTab {
  const tab = document.body.dataset.posMobileTab

  return posMobileTabs.includes(tab as PosMobileTab)
    ? (tab as PosMobileTab)
    : "barang"
}

function subscribePosMobileTab(onStoreChange: () => void) {
  window.addEventListener("pos-mobile-tab-change", onStoreChange)

  return () =>
    window.removeEventListener("pos-mobile-tab-change", onStoreChange)
}

function getPengaturanDetailSnapshot(): string | null {
  return document.body.dataset.pengaturanDetailTitle ?? null
}

function subscribePengaturanDetail(onStoreChange: () => void) {
  window.addEventListener("pengaturan-detail-change", onStoreChange)

  return () =>
    window.removeEventListener("pengaturan-detail-change", onStoreChange)
}

function getTransaksiDetailSnapshot(): boolean {
  return document.body.dataset.transaksiDetail === "true"
}

function subscribeTransaksiDetail(onStoreChange: () => void) {
  window.addEventListener("transaksi-detail-change", onStoreChange)

  return () =>
    window.removeEventListener("transaksi-detail-change", onStoreChange)
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
  const isTransaksiDetail = useSyncExternalStore(
    subscribeTransaksiDetail,
    getTransaksiDetailSnapshot,
    () => false
  )

  const userName = session?.user?.name ?? "Admin"
  const userEmail = session?.user?.email ?? undefined
  const userRole = session?.user?.role ?? "admin"

  const posMobileHeaders: Record<PosMobileTab, MobileHeaderConfig> = {
    barang: { title: "Warung Mama Nia", icon: Store01Icon },
    keranjang: { title: "Checkout", icon: ShoppingCart01Icon },
    pembayaran: { title: "Pembayaran", icon: InvoiceIcon },
  }

  const isBarangList = pathname === "/admin/barang/daftar"
  const isBarangTambah = pathname === "/admin/barang/tambah"
  const isBarangEdit = /^\/admin\/barang\/[^/]+\/edit$/.test(pathname)
  const isBarangDetail =
    /^\/admin\/barang\/[^/]+$/.test(pathname) &&
    !isBarangList &&
    !isBarangTambah
  const isKategoriPage = pathname === "/admin/kategori"
  const isKategoriTambah = pathname === "/admin/kategori/tambah"
  const isKategoriEdit = /^\/admin\/kategori\/[^/]+\/edit$/.test(pathname)
  const isTransaksiPage = pathname === "/admin/transaksi"
  const isTransaksiDetailPage =
    /^\/admin\/transaksi\/[^/]+$/.test(pathname) &&
    !/^\/admin\/transaksi\/[^/]+\/edit$/.test(pathname)
  const isTransaksiEdit = /^\/admin\/transaksi\/[^/]+\/edit$/.test(pathname)
  const transaksiEditId = isTransaksiEdit
    ? pathname.match(/^\/admin\/transaksi\/([^/]+)\/edit$/)?.[1]
    : null

  const isPosPage = pathname === "/admin/pos"
  const isPengaturanPage = pathname.startsWith("/admin/pengaturan")
  const isPengaturanDetail = isPengaturanPage && !!pengaturanDetailTitle
  const isPengaturanSubPage =
    isPengaturanPage && pathname !== "/admin/pengaturan"
  const isPosSubStep = isPosPage && posMobileTab !== "barang"
  const activeAdminHeader = adminMobileHeaders.find((item) =>
    pathname.startsWith(item.href)
  )

  const pengaturanHeader: MobileHeaderConfig = pathname.startsWith(
    "/admin/pengaturan/tambah-akun"
  )
    ? { title: "Tambah Akun" }
    : pathname.startsWith("/admin/pengaturan/akun")
      ? { title: "Manajemen Akun" }
      : pathname.startsWith("/admin/pengaturan/tema")
        ? { title: "Tema Tampilan" }
        : { title: pengaturanDetailTitle ?? "Pengaturan" }

  const mobileHeader: MobileHeaderConfig = (() => {
    if (isPosPage) return posMobileHeaders[posMobileTab]
    if (isPengaturanPage) return pengaturanHeader
    if (isBarangList) return { title: "Daftar Barang" }
    if (isBarangTambah) return { title: "Tambah Barang" }
    if (isBarangEdit) return { title: "Edit Barang" }
    if (isBarangDetail) return { title: "Detail Barang" }
    if (isKategoriTambah) return { title: "Tambah Kategori" }
    if (isKategoriEdit) return { title: "Edit Kategori" }
    if (isTransaksiDetailPage || (isTransaksiPage && isTransaksiDetail))
      return { title: "Detail Transaksi" }
    if (isTransaksiEdit) return { title: "Edit Transaksi" }
    if (activeAdminHeader) return { title: activeAdminHeader.title }

    return { title: "Dashboard" }
  })()

  const handleMobileHeaderAction = () => {
    if (isBarangDetail) {
      router.push("/admin/barang/daftar")
      return
    }

    if (pathname.startsWith("/admin/barang") && pathname !== "/admin/barang") {
      router.push("/admin/barang")
      return
    }

    if (pathname.startsWith("/admin/kategori")) {
      router.push(
        pathname === "/admin/kategori" ? "/admin/barang" : "/admin/kategori"
      )
      return
    }

    if (isTransaksiPage && isTransaksiDetail) {
      window.dispatchEvent(new Event("transaksi-detail-back"))
      return
    }

    if (isTransaksiDetailPage) {
      router.push("/admin/transaksi")
      return
    }

    if (isTransaksiEdit && transaksiEditId) {
      router.push(`/admin/transaksi/${transaksiEditId}`)
      return
    }

    if (isPengaturanDetail) {
      window.dispatchEvent(new Event("pengaturan-detail-back"))
      return
    }

    if (isPengaturanSubPage) {
      router.push("/admin/pengaturan")
      return
    }

    if (isPosSubStep) {
      window.dispatchEvent(
        new CustomEvent("pos-mobile-tab-request", {
          detail: {
            tab: posMobileTab === "pembayaran" ? "keranjang" : "barang",
          },
        })
      )
      return
    }

    setIsMobileSidebarOpen(true)
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <header className="shrink-0 bg-primary px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleMobileHeaderAction}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/15"
          >
            <HugeiconsIcon
              icon={
                (pathname.startsWith("/admin/barang") &&
                  pathname !== "/admin/barang") ||
                pathname.startsWith("/admin/kategori") ||
                (isTransaksiPage && isTransaksiDetail) ||
                isTransaksiDetailPage ||
                isTransaksiEdit ||
                isPengaturanDetail ||
                isPengaturanSubPage ||
                isPosSubStep
                  ? ArrowLeft01Icon
                  : Menu01Icon
              }
              size={20}
            />
          </button>

          <div className="mx-3 flex min-w-0 flex-1 items-center justify-center gap-2">
            {mobileHeader.icon ? (
              <HugeiconsIcon
                icon={mobileHeader.icon}
                size={20}
                className="shrink-0 text-primary-foreground"
              />
            ) : null}
            <span className="truncate text-[15px] leading-none font-bold text-primary-foreground">
              {mobileHeader.title}
            </span>
          </div>

          {isBarangList ? (
            <Link
              href="/admin/barang/tambah"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/15"
              aria-label="Tambah barang"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={20} />
            </Link>
          ) : isKategoriPage ? (
            <Link
              href="/admin/kategori/tambah"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/15"
              aria-label="Tambah kategori"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={20} />
            </Link>
          ) : (
            <div className="w-8" />
          )}
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>

      <AdminMobileSidebar
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
        user={{ name: userName, email: userEmail, role: userRole }}
      />
    </div>
  )
}

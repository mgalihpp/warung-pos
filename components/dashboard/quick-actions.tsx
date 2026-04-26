import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddInvoiceIcon, PackageIcon, ArrowRight01Icon, InvoiceIcon } from "@hugeicons/core-free-icons"

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 2xl:grid-cols-1">
      <Link
        href="/admin/pos"
        className="group flex items-center justify-between rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={AddInvoiceIcon} size={18} />
          <span>Tambah Transaksi</span>
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
      <Link
        href="/admin/transaksi"
        className="group flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
      >
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={InvoiceIcon} size={18} className="text-primary" />
          <span>Lihat Transaksi</span>
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-primary opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
      <Link
        href="/admin/produk"
        className="group flex items-center justify-between rounded-xl bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-600 shadow-sm transition-colors hover:bg-yellow-500/20 dark:text-yellow-500"
      >
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={PackageIcon} size={18} className="text-yellow-600 dark:text-yellow-500" />
          <span>Tambah Produk</span>
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-yellow-600 opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-yellow-500" />
      </Link>
    </div>
  )
}

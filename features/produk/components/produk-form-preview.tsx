"use client"

import * as React from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PackageIcon,
  InformationCircleIcon,
  Rocket01Icon,
  RefreshIcon,
  Copy01Icon,
  FloppyDiskIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/format-currency"

type FormValues = {
  name: string
  category: string
  unit: string
  sellPrice: number
  buyPrice: number
  stock: number
  isActive: boolean
  image: string | null
}

type PreviewSidebarProps = {
  mode: "create" | "edit"
  values: FormValues
  onSaveAndContinue?: () => void
  onReset?: () => void
  onDuplicate?: () => void
  isPending?: boolean
}

export function PreviewSidebar({
  mode,
  values,
  onSaveAndContinue,
  onReset,
  onDuplicate,
  isPending,
}: PreviewSidebarProps) {
  const margin =
    values.buyPrice > 0
      ? (((values.sellPrice - values.buyPrice) / values.buyPrice) * 100).toFixed(1)
      : "0"

  return (
    <div className="flex w-full flex-col gap-4 xl:w-[340px] xl:shrink-0">
      {/* Preview Produk */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Preview Produk</h3>
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 p-4">
          <div className="relative size-24 overflow-hidden rounded-xl bg-white shadow-sm">
            {values.image ? (
              <Image
                src={values.image}
                alt={values.name || "Preview"}
                fill
                className="object-contain p-1"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <HugeiconsIcon icon={PackageIcon} size={32} />
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {values.name || "Nama Produk"}
            </p>
            <p className="text-xs text-muted-foreground">
              {values.category || "Kategori"}
            </p>
            <p className="mt-1 text-lg font-bold text-primary">
              {values.sellPrice > 0 ? formatRupiah(values.sellPrice) : "Rp0"}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Stok {values.stock}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  values.isActive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-slate-500/10 text-slate-500"
                }`}
              >
                {values.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Ringkasan</h3>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kategori</span>
            <span className="font-medium">{values.category || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Satuan</span>
            <span className="font-medium capitalize">{values.unit || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Harga Jual</span>
            <span className="font-medium">
              {values.sellPrice > 0 ? formatRupiah(values.sellPrice) : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin</span>
            <span className="font-medium">{margin}%</span>
          </div>
        </div>
      </div>

      {/* Tips Pengisian (create only) */}
      {mode === "create" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={16}
              className="text-amber-500"
            />
            Tips Pengisian
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Tambahkan foto produk yang jelas
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Atur stok minimum agar mudah dipantau
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Pastikan harga jual lebih tinggi dari harga beli
            </li>
          </ul>
        </div>
      )}

      {/* Aksi Cepat */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Aksi Cepat</h3>
        <div className="flex flex-col gap-2">
          {mode === "create" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                onClick={onSaveAndContinue}
                disabled={isPending}
              >
                <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                Simpan & Tambah Lagi
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={onReset}
              >
                <HugeiconsIcon icon={RefreshIcon} size={16} />
                Reset Form
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                onClick={onSaveAndContinue}
                disabled={isPending}
              >
                <HugeiconsIcon icon={Rocket01Icon} size={16} />
                Simpan & Lanjut
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={onDuplicate}
              >
                <HugeiconsIcon icon={Copy01Icon} size={16} />
                Duplikat Produk
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

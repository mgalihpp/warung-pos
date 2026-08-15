/**
 * Format angka ke format Rupiah: Rp75.000
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format angka dengan pemisah ribuan: 75.000
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount)
}

/**
 * Satuan kompak untuk label sumbu grafik berdasarkan nilai maksimum:
 * < 1.000 → "", 1rb → "rb", 1jt → "jt", 1miliar → "m"
 */
export function compactUnit(maxValue: number): {
  unit: "" | "rb" | "jt" | "m"
  divisor: number
} {
  const unit =
    maxValue >= 1_000_000_000 ? "m" : maxValue >= 1_000_000 ? "jt" : maxValue >= 1_000 ? "rb" : ""
  return {
    unit,
    divisor:
      unit === "m" ? 1_000_000_000 : unit === "jt" ? 1_000_000 : unit === "rb" ? 1_000 : 1,
  }
}

/**
 * Format nilai dengan satuan kompak seragam untuk label sumbu grafik.
 * formatCompact(1_250_000, 5_000_000) → "1,3 jt"
 */
export function formatCompact(value: number, maxValue: number): string {
  const { unit, divisor } = compactUnit(maxValue)
  return `${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(value / divisor)}${unit ? ` ${unit}` : ""}`
}

/**
 * Parse string angka (dengan/tanpa pemisah) ke number.
 * "75.000" → 75000, "75000" → 75000, "" → 0
 */
export function parseRupiahInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "")
  return cleaned ? parseInt(cleaned, 10) : 0
}

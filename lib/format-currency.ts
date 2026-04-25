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
 * Parse string angka (dengan/tanpa pemisah) ke number.
 * "75.000" → 75000, "75000" → 75000, "" → 0
 */
export function parseRupiahInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "")
  return cleaned ? parseInt(cleaned, 10) : 0
}

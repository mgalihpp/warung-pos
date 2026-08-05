import "server-only"

export const TZ = "Asia/Jakarta"

export function startOfDayJakarta(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")!.value
  const m = parts.find((p) => p.type === "month")!.value
  const day = parts.find((p) => p.type === "day")!.value
  return new Date(`${y}-${m}-${day}T00:00:00+07:00`)
}

export function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function addMonths(d: Date, n: number) {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

export function startOfMonthJakarta(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")!.value
  const m = parts.find((p) => p.type === "month")!.value
  return new Date(`${y}-${m}-01T00:00:00+07:00`)
}

export function startOfYearJakarta(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")!.value
  return new Date(`${y}-01-01T00:00:00+07:00`)
}

export function jakartaDateKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

export function pctChange(current: number, previous: number): number | null {
  if (previous <= 0) return null
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

export function mapPaymentLabel(method: string): "Tunai" | "QRIS" | "Transfer" {
  switch (method) {
    case "CASH":
      return "Tunai"
    case "QRIS_MANUAL":
      return "QRIS"
    case "MANUAL_TRANSFER":
      return "Transfer"
    default:
      return "Tunai"
  }
}

export type LaporanRange = "7d" | "30d" | "ytd"

export function resolveRange(now: Date, range: LaporanRange) {
  const startToday = startOfDayJakarta(now)
  const startTomorrow = addDays(startToday, 1)
  if (range === "7d") {
    return {
      start: addDays(startToday, -6),
      end: startTomorrow,
      prevStart: addDays(startToday, -13),
      prevEnd: addDays(startToday, -6),
      days: 7,
    }
  }
  if (range === "30d") {
    return {
      start: addDays(startToday, -29),
      end: startTomorrow,
      prevStart: addDays(startToday, -59),
      prevEnd: addDays(startToday, -29),
      days: 30,
    }
  }
  // ytd
  const startYear = startOfYearJakarta(now)
  return {
    start: startYear,
    end: startTomorrow,
    prevStart: startOfYearJakarta(addMonths(now, -12)),
    prevEnd: startYear,
    days: Math.max(
      1,
      Math.round(
        (startTomorrow.getTime() - startYear.getTime()) / (24 * 60 * 60 * 1000)
      )
    ),
  }
}

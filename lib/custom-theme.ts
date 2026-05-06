export const CUSTOM_THEME_STORAGE_KEY = "warung-sembako-custom-theme"
export const DEFAULT_PRIMARY_COLOR = "#c2410c"

const THEME_COLOR_VARIABLES = [
  "--primary",
  "--ring",
  "--sidebar-primary",
  "--chart-4",
  "--color-chart-4",
]

const THEME_ACCENT_VARIABLES = [
  "--chart-2",
  "--color-chart-2",
]

const THEME_FOREGROUND_VARIABLES = [
  "--primary-foreground",
  "--sidebar-primary-foreground",
]

export type CustomTheme = {
  primaryColor: string
}

export function normalizeHexColor(value: string) {
  const trimmed = value.trim()

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed
      .slice(1)
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`.toLowerCase()
  }

  return DEFAULT_PRIMARY_COLOR
}

export function getReadableForeground(hexColor: string) {
  const normalized = normalizeHexColor(hexColor)
  const luminance = getColorLuminance(normalized)

  return luminance > 0.62 ? "#111827" : "#ffffff"
}

function getColorLuminance(hexColor: string) {
  const normalized = normalizeHexColor(hexColor)
  const red = Number.parseInt(normalized.slice(1, 3), 16)
  const green = Number.parseInt(normalized.slice(3, 5), 16)
  const blue = Number.parseInt(normalized.slice(5, 7), 16)

  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255
}

function mixHexColor(hexColor: string, targetColor: string, amount: number) {
  const normalized = normalizeHexColor(hexColor)
  const normalizedTarget = normalizeHexColor(targetColor)
  const source = [1, 3, 5].map((start) => Number.parseInt(normalized.slice(start, start + 2), 16))
  const target = [1, 3, 5].map((start) => Number.parseInt(normalizedTarget.slice(start, start + 2), 16))

  const mixed = source.map((value, index) => {
    const nextValue = Math.round(value + (target[index] - value) * amount)
    return nextValue.toString(16).padStart(2, "0")
  })

  return `#${mixed.join("")}`
}

function getChartAccentColor(hexColor: string) {
  const normalized = normalizeHexColor(hexColor)
  const targetColor = getColorLuminance(normalized) > 0.55 ? "#000000" : "#ffffff"

  return mixHexColor(normalized, targetColor, 0.28)
}

export function applyCustomTheme(theme: CustomTheme) {
  if (typeof document === "undefined") return

  const primaryColor = normalizeHexColor(theme.primaryColor)
  const foregroundColor = getReadableForeground(primaryColor)
  const accentColor = getChartAccentColor(primaryColor)
  const root = document.documentElement

  for (const variable of THEME_COLOR_VARIABLES) {
    root.style.setProperty(variable, primaryColor)
  }

  for (const variable of THEME_FOREGROUND_VARIABLES) {
    root.style.setProperty(variable, foregroundColor)
  }

  for (const variable of THEME_ACCENT_VARIABLES) {
    root.style.setProperty(variable, accentColor)
  }
}

export function clearCustomTheme() {
  if (typeof document === "undefined") return

  const root = document.documentElement

  for (const variable of [...THEME_COLOR_VARIABLES, ...THEME_ACCENT_VARIABLES, ...THEME_FOREGROUND_VARIABLES]) {
    root.style.removeProperty(variable)
  }
}

export function loadCustomTheme() {
  if (typeof window === "undefined") return null

  const rawTheme = window.localStorage.getItem(CUSTOM_THEME_STORAGE_KEY)

  if (!rawTheme) return null

  try {
    const parsed = JSON.parse(rawTheme) as Partial<CustomTheme>

    if (typeof parsed.primaryColor !== "string") {
      return null
    }

    return { primaryColor: normalizeHexColor(parsed.primaryColor) }
  } catch {
    return null
  }
}

export function saveCustomTheme(theme: CustomTheme) {
  if (typeof window === "undefined") return

  const normalizedTheme = { primaryColor: normalizeHexColor(theme.primaryColor) }

  window.localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(normalizedTheme))
  applyCustomTheme(normalizedTheme)
}

export function removeCustomTheme() {
  if (typeof window === "undefined") return

  window.localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY)
  clearCustomTheme()
}

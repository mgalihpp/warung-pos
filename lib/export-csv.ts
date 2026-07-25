export function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const lines = headers.length > 0 ? [headers.join(",")] : []
  lines.push(
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  )
  const csvContent = lines.join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

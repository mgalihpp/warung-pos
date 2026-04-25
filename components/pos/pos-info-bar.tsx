import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons"

export function PosInfoBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
      {/* Shift Kasir */}
      <div className="bg-card p-4 rounded-xl border flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={UserIcon} size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Shift Kasir</span>
          <span className="text-sm font-bold text-foreground">Siti</span>
          <span className="text-[10px] text-muted-foreground">Mulai: 08:00 WIB</span>
        </div>
      </div>

      {/* Transaksi Aktif */}
      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={Invoice01Icon} size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Transaksi Aktif</span>
          <span className="text-sm font-bold text-foreground">TRX-240524-019</span>
          <span className="text-[10px] text-muted-foreground">24 Mei 2025 • 10:35 WIB</span>
        </div>
      </div>

    </div>
  )
}

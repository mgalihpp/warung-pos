import { HugeiconsIcon } from "@hugeicons/react"
import {
  Money01Icon,
  QrCodeIcon,
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format-currency"
import type { PaymentMethodItem } from "@/features/dashboard/hooks/use-dashboard-queries"

const METHOD_STYLE: Record<
  PaymentMethodItem["name"],
  { icon: typeof Money01Icon; bg: string; color: string }
> = {
  Tunai: { icon: Money01Icon, bg: "bg-emerald-500/10", color: "text-emerald-600" },
  QRIS: { icon: QrCodeIcon, bg: "bg-blue-500/10", color: "text-blue-600" },
  Transfer: {
    icon: ArrowDataTransferHorizontalIcon,
    bg: "bg-violet-500/10",
    color: "text-violet-600",
  },
}

export function PaymentMethods({ methods }: { methods: PaymentMethodItem[] }) {
  const paymentMethods = methods.map((m) => ({ ...m, ...METHOD_STYLE[m.name] }))
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Metode Pembayaran</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 2xl:grid-cols-1">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${method.bg}`}>
                <HugeiconsIcon icon={method.icon} size={18} className={method.color} />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="truncate text-xs font-medium">{method.name}</span>
                <span className="text-[10px] text-muted-foreground">{method.percentage}% total</span>
              </div>
            </div>
            <p className="shrink-0 text-right text-xs font-semibold">{formatRupiah(method.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

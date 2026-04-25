import { HugeiconsIcon } from "@hugeicons/react"
import {
  Money01Icon,
  QrCodeIcon,
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { formatRupiah } from "@/lib/format"

const paymentMethods = [
  {
    name: "Tunai",
    amount: 1250000,
    percentage: 51,
    icon: Money01Icon,
    bg: "bg-emerald-500/10",
    color: "text-emerald-600",
  },
  {
    name: "QRIS",
    amount: 950000,
    percentage: 39,
    icon: QrCodeIcon,
    bg: "bg-blue-500/10",
    color: "text-blue-600",
  },
  {
    name: "Transfer",
    amount: 250000,
    percentage: 10,
    icon: ArrowDataTransferHorizontalIcon,
    bg: "bg-violet-500/10",
    color: "text-violet-600",
  },
]

export function PaymentMethods() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Metode Pembayaran</h3>
      <div className="grid grid-cols-3 gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex flex-col items-center gap-1.5 rounded-lg border bg-muted/30 p-2 text-center transition-colors hover:bg-muted/50"
          >
            <div className={`flex size-8 items-center justify-center rounded-lg ${method.bg}`}>
              <HugeiconsIcon icon={method.icon} size={18} className={method.color} />
            </div>
            <span className="text-xs font-medium">{method.name}</span>
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold">{formatRupiah(method.amount)}</p>
              <p className="text-[10px] text-muted-foreground">({method.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

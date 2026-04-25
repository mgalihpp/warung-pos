import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { products, formatCurrency, type Product } from "./pos-data"

type PosProductGridProps = {
  items?: Product[]
}

export function PosProductGrid({ items = products }: PosProductGridProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4 scrollbar-hide">
      <div className="grid grid-cols-3 min-[1399px]:grid-cols-4 gap-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden bg-card border rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3 mb-3">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary border-primary/20 text-xl font-bold">
                {product.name.charAt(0)}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1">
                  {product.name}
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Stok {product.stock}
                </span>
              </div>
            </div>
            <button className="w-full py-1.5 flex items-center justify-center gap-1 border border-primary/30 text-primary rounded-lg text-xs font-semibold hover:bg-primary/10 transition-colors mt-auto">
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
              Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

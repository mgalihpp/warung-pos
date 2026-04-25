import { categories, type Category } from "./pos-data"

type PosCategoryFilterProps = {
  items?: Category[]
}

export function PosCategoryFilter({ items = categories }: PosCategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto shrink-0 pb-1 scrollbar-hide">
      {items.map((cat, idx) => (
        <button
          key={idx}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
            cat.active
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:bg-accent"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

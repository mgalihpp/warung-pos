"use client"

type CategoryItem = {
  id: string
  name: string
}

type PosCategoryFilterProps = {
  categories: CategoryItem[]
  activeCategory: string | null
  onSelect: (categoryId: string | null) => void
}

export function PosCategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: PosCategoryFilterProps) {
  return (
    <div className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
          activeCategory === null
            ? "border-primary bg-primary text-primary-foreground shadow-sm"
            : "border-border bg-card text-muted-foreground hover:bg-accent"
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeCategory === cat.id
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

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
    <div className="flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
          activeCategory === null
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-card text-muted-foreground border-border hover:bg-accent"
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
            activeCategory === cat.id
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

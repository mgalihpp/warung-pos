"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, FileImportIcon, FileExportIcon } from "@hugeicons/core-free-icons"

export function ProdukHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Menutup menu jika klik di luar (opsional, tapi untuk UX lebih baik biarkan user klik tombol silang atau overlay)
  
  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola semua produk warung Anda</p>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Tambah Produk
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
            <HugeiconsIcon icon={FileImportIcon} size={16} />
            Import
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
            <HugeiconsIcon icon={FileExportIcon} size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Mobile Floating Action Button Overlay & Menu */}
      <div className="lg:hidden">
        {/* Overlay background when menu is open */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Floating Button Container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          
          {/* Menu Items */}
          <div 
            className={`flex flex-col items-end gap-3 transition-all duration-200 origin-bottom ${
              isMobileMenuOpen 
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            }`}
          >
            <button className="group flex items-center justify-end gap-3">
              <span className="rounded-md bg-card border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors group-hover:bg-muted">
                Export Data
              </span>
              <div className="flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-sm transition-colors group-hover:bg-muted">
                <HugeiconsIcon icon={FileExportIcon} size={20} />
              </div>
            </button>
            
            <button className="group flex items-center justify-end gap-3">
              <span className="rounded-md bg-card border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors group-hover:bg-muted">
                Import Data
              </span>
              <div className="flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-sm transition-colors group-hover:bg-muted">
                <HugeiconsIcon icon={FileImportIcon} size={20} />
              </div>
            </button>
            
            <button className="group flex items-center justify-end gap-3">
              <span className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                Tambah Produk
              </span>
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                <HugeiconsIcon icon={PlusSignIcon} size={20} />
              </div>
            </button>
          </div>

          {/* Main Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
              isMobileMenuOpen ? "bg-card text-foreground border" : "bg-primary text-primary-foreground"
            }`}
          >
            <HugeiconsIcon 
              icon={PlusSignIcon} 
              size={28} 
              className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45" : ""}`} 
            />
          </button>
        </div>
      </div>
    </>
  )
}

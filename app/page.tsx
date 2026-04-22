import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Warung Sembako Pos</h1>
          <p>Aplikasi web untuk mengelola produk, stok, dan transaksi warung sembako.</p>
          <p>Tampilan awal kini memakai identitas Warung Sembako Pos.</p>
          <Button className="mt-2">Mulai</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Tekan <kbd>d</kbd> untuk mengganti mode gelap)
        </div>
      </div>
    </div>
  )
}

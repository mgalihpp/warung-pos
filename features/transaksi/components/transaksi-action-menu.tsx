"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreVerticalCircle01Icon,
  Delete02Icon,
  Edit02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import type { TransactionStatus } from "../hooks/use-transaksi-queries"
import { useDeleteTransaction } from "../hooks/use-transaksi-actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type Props = {
  transactionId: string
  transactionNumber: string
  currentStatus: TransactionStatus
  basePath: string
}

export function TransaksiActionMenu({
  transactionId,
  transactionNumber,
  currentStatus,
  basePath,
}: Props) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const deleteMutation = useDeleteTransaction()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex min-h-10 min-w-10 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
            title="Lainnya"
          >
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => router.push(`${basePath}/${transactionId}/edit`)}
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size={16}
              className="text-muted-foreground"
            />
            <span>Edit Transaksi</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
            <span>Hapus Transaksi</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation — matches barang delete dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
              Hapus Transaksi?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 leading-relaxed">
              Anda yakin ingin menghapus transaksi{" "}
              <strong className="font-semibold text-foreground">
                {transactionNumber}
              </strong>
              ? Tindakan ini permanen.
              {currentStatus === "Selesai" && (
                <>
                  <br />
                  <br />
                  *Stok barang yang terkait akan otomatis dikembalikan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel
              onClick={() => setDeleteOpen(false)}
              className="mt-0 w-full sm:w-auto"
            >
              Batal
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              loading={deleteMutation.isPending}
              loadingText="Menghapus..."
              onClick={() => {
                deleteMutation.mutate(transactionId, {
                  onSuccess: (result) => {
                    if (result.success) {
                      toast.success("Transaksi berhasil dihapus")
                      setDeleteOpen(false)
                      return
                    }

                    toast.error(result.error ?? "Transaksi gagal dihapus")
                  },
                  onError: () => toast.error("Transaksi gagal dihapus"),
                })
              }}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

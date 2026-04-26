"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { generateReactHelpers } from "@uploadthing/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import Image from "next/image"

import { cn } from "@/lib/utils"
import type { AppFileRouter } from "@/app/api/uploadthing/core"

const { useUploadThing } = generateReactHelpers<AppFileRouter>()

type ImageUploadProps = {
  value?: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value ?? null)
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (res: { url: string }[]) => {
      if (res[0]?.url) {
        setPreview(res[0].url)
        onChange(res[0].url)
      }
    },
    onUploadError: () => {
      onChange(null)
    },
  })

  if (value !== preview) {
    setPreview(value ?? null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      startUpload([file])
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      startUpload([file])
    }
  }

  function handleRemove() {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  if (preview) {
    return (
      <div className="relative h-32 w-32 overflow-hidden rounded-2xl border bg-muted">
        <Image src={preview} alt="Preview" fill className="object-contain" />
        {!disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={12} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-muted-foreground transition-colors",
        isDragging && "border-primary bg-primary/5",
        !disabled && "hover:border-primary hover:bg-muted"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled || isUploading}
      />
      {isUploading ? (
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <>
          <Upload size={24} />
          <p className="px-1 text-center text-[10px] leading-tight">
            Upload Gambar
          </p>
        </>
      )}
    </div>
  )
}

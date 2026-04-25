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
      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border bg-muted">
        <Image
          src={preview}
          alt="Preview"
          fill
          className="object-cover"
        />
        {!disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
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
        "w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-muted-foreground",
        isDragging && "border-primary bg-primary/5",
        !disabled && "hover:border-primary hover:bg-muted"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
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
          <p className="text-[10px] text-center px-1 leading-tight">Upload Gambar</p>
        </>
      )}
    </div>
  )
}
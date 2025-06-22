"use client"

import * as React from "react"
import { UploadCloud, File as FileIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value?: File | null
  onValueChange?: (file: File | null) => void
  containerClassName?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, value, onValueChange, containerClassName, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      onValueChange?.(file)
    }

    const handleRemoveFile = () => {
      onValueChange?.(null)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const file = event.dataTransfer.files?.[0] || null
      onValueChange?.(file)
    }

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    
    return (
      <div className={cn("w-full", containerClassName)}>
        {value ? (
          <div className="flex items-center justify-between rounded-md border border-input bg-background p-3">
            <div className="flex items-center gap-3">
              <FileIcon className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium text-foreground">{value.name}</p>
                <p className="text-muted-foreground">{(value.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="rounded-md p-1 text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </button>
          </div>
        ) : (
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-background p-6 text-center transition-colors hover:border-primary/50",
              className
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">Click or drag & drop to upload</p>
            <p className="text-sm text-muted-foreground">
              PDF, PNG, JPG up to 10MB
            </p>
            <input
              ref={(node) => {
                if (typeof ref === 'function') ref(node)
                if (inputRef) (inputRef.current as any) = node
              }}
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              {...props}
            />
          </label>
        )}
      </div>
    )
  }
)

FileInput.displayName = "FileInput"

export { FileInput }

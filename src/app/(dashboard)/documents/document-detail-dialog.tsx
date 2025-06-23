"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Document } from "@/lib/data"

interface DocumentDetailDialogProps {
  document: Document | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function DocumentDetailDialog({
  document,
  isOpen,
  onOpenChange,
}: DocumentDetailDialogProps) {
  if (!document) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>
            Details for document ID: {document.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <Link
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Click to view full document"
            >
              <Image
                src={document.fileUrl}
                alt={`Thumbnail for ${document.name}`}
                width={200}
                height={280}
                className="rounded-md border object-cover transition-transform hover:scale-105"
                data-ai-hint="document scan"
              />
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{document.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={
                  document.status === "Active"
                    ? "secondary"
                    : document.status === "Expiring Soon"
                    ? "default"
                    : "destructive"
                }
                className={
                  document.status === "Expiring Soon"
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              >
                {document.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Upload Date:</span>
              <span className="font-medium">
                {format(new Date(document.uploadDate), "PPP")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiry Date:</span>
              <span className="font-medium">
                {document.expiryDate
                  ? format(new Date(document.expiryDate), "PPP")
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost:</span>
              <span className="font-medium">
                AED {document.cost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">{document.version}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { type Document } from "@/lib/data"

interface DocumentRenewalDialogProps {
  document: Document | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function DocumentRenewalDialog({
  document,
  isOpen,
  onOpenChange,
}: DocumentRenewalDialogProps) {
  const [newExpiryDate, setNewExpiryDate] = React.useState<Date | undefined>(undefined);

  const handleSave = () => {
    // In a real app, you would handle the renewal logic here.
    console.log("Renewing document:", document?.id, "with new expiry date:", newExpiryDate);
    onOpenChange(false);
    setNewExpiryDate(undefined);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    setNewExpiryDate(undefined);
  }

  if (!document) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Renew Document: {document.name}</DialogTitle>
          <DialogDescription>
            Update the expiry date for this document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
             <Label htmlFor="expiry-date">New Expiry Date</Label>
             <DatePicker
                value={newExpiryDate}
                onChange={(date) => setNewExpiryDate(date as Date)}
                placeholder="Select new expiry date"
              />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Renewal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { FileInput } from "@/components/ui/file-input"
import { type Document } from "@/lib/data"

const formSchema = z.object({
  file: z.instanceof(File).optional(),
  documentName: z.string().min(1, { message: "Document name is required." }),
  expiryDate: z.date({ required_error: "New expiry date is required." }),
  cost: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      documentName: "",
      expiryDate: undefined,
      cost: 0,
    }
  });

  React.useEffect(() => {
    if (document) {
      form.reset({
        documentName: document.name,
        cost: document.cost,
        expiryDate: document.expiryDate ? new Date(document.expiryDate) : undefined,
        file: undefined,
      });
    }
  }, [document, form, isOpen]);

  const onSubmit = (values: FormValues) => {
    // In a real app, you would:
    // 1. Upload the new file if provided.
    // 2. Create an archived version of the old document.
    // 3. Update the existing document with new details.
    console.log("Renewing document with values:", values);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  }

  if (!document) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Renew Document: {document.name}</DialogTitle>
          <DialogDescription>
            Upload the new document and update its details. The old version will be archived.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Document File (Optional)</FormLabel>
                  <FormControl>
                    <FileInput
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="documentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>New Expiry Date</FormLabel>
                      <FormControl>
                        <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select new expiry date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renewal Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button type="submit">Save Renewal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

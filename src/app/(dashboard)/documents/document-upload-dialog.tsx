
"use client";

import * as React from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useFlowState } from "@/hooks/use-flow-state";
import { suggestDocumentCategory } from "@/ai/flows/suggest-document-category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { FileInput } from "@/components/ui/file-input";
import { documentCategories } from "@/lib/data";

const formSchema = z.object({
  file: z.instanceof(File).refine(file => file, { message: "File is required." }),
  documentName: z.string().min(1, { message: "Document name is required." }),
  companyName: z.string().min(1, { message: "Company name is required." }),
  personName: z.string().min(1, { message: "Person name is required." }),
  category: z.string().min(1, { message: "Please select a category." }),
  tags: z.string().optional(),
  expiryDate: z.date().optional(),
  cost: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


export function DocumentUploadDialog() {
  const [open, setOpen] = React.useState(false);
  const suggestionFlow = useFlowState(suggestDocumentCategory);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        file: undefined,
        documentName: "",
        companyName: "",
        personName: "",
        category: "",
        tags: "",
        expiryDate: undefined,
        cost: 0,
    }
  });

  const file = form.watch("file");

  React.useEffect(() => {
    if (file) {
      form.setValue("documentName", file.name.replace(/\.[^/.]+$/, ""));
      const getSuggestions = async () => {
        const dataUri = await fileToDataUri(file);
        const result = await suggestionFlow.runFlow({ documentDataUri: dataUri });
        if (result) {
          const matchingCategory = documentCategories.find(c => c.name.toLowerCase() === result.suggestedCategory.toLowerCase());
          if (matchingCategory) {
            form.setValue("category", matchingCategory.id);
          }
          form.setValue("tags", result.suggestedTags.join(", "));
        }
      };
      getSuggestions();
    } else {
      suggestionFlow.reset();
      form.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const onSubmit = (values: FormValues) => {
    console.log(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Upload Document
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to the system. AI will suggest a category and tags.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
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

            {suggestionFlow.isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm p-4 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing document...
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="documentName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Document Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe - Passport" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name or 'N/A'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                 <FormField
                  control={form.control}
                  name="personName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person Name</FormLabel>
                       <FormControl>
                        <Input placeholder="Enter person name or 'N/A'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., travel, official" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                       <FormControl>
                         <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="No expiry"
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
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save Document</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

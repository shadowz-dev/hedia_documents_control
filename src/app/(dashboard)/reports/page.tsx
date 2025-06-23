"use client"

import * as React from "react"
import { File } from "lucide-react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { documents, documentCategories } from "@/lib/data"

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  )
  const [category, setCategory] = React.useState("all")
  const [filteredDocuments, setFilteredDocuments] = React.useState(documents)

  const handleGenerateReport = () => {
    let filtered = documents

    if (dateRange?.from) {
      filtered = filtered.filter((doc) => {
        const uploadDate = new Date(doc.uploadDate)
        if (dateRange.to) {
          return uploadDate >= dateRange.from! && uploadDate <= dateRange.to
        }
        return uploadDate >= dateRange.from!
      })
    }

    if (category !== "all") {
      const categoryName = documentCategories.find(
        (c) => c.id === category
      )?.name
      if (categoryName) {
        filtered = filtered.filter((doc) => doc.category === categoryName)
      }
    }
    setFilteredDocuments(filtered)
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Reports</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document Reports</CardTitle>
          <CardDescription>
            Generate and view detailed reports for your documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Date range</span>
              <DatePicker
                mode="range"
                value={dateRange}
                onChange={(range) =>
                  setDateRange(range as DateRange | undefined)
                }
                placeholder="Select a date range"
                className="w-full sm:w-[260px]"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Category</span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="self-end" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>
                      {format(new Date(doc.uploadDate), "PPP")}
                    </TableCell>
                    <TableCell>
                      {doc.expiryDate
                        ? format(new Date(doc.expiryDate), "PPP")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${doc.cost.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No documents found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

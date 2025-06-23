
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { archivedDocuments, type Document } from "@/lib/data"
import { format } from "date-fns"

export default function ArchivePage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Archive</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Archived Documents</CardTitle>
          <CardDescription>
            View past versions of renewed documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Document Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivedDocuments.length > 0 ? (
                archivedDocuments.map((doc: Document) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.companyName}</TableCell>
                    <TableCell className="font-medium">{doc.personName}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.version}</TableCell>
                    <TableCell>
                      {doc.expiryDate
                        ? format(new Date(doc.expiryDate), "PPP")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No archived documents found.
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

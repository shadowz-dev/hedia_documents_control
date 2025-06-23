"use client"

import * as React from "react"
import { File, ListFilter, UserSearch } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { documents, documentCategories, documentEntities, type Document } from "@/lib/data"
import { DocumentUploadDialog } from "./document-upload-dialog"
import { DocumentDetailDialog } from "./document-detail-dialog"
import { DocumentRenewalDialog } from "./document-renewal-dialog"

type Status = "all" | "active" | "expiring" | "expired"

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [renewalDocument, setRenewalDocument] = React.useState<Document | null>(null);

  const [activeTab, setActiveTab] = React.useState<Status>("all");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedEntities, setSelectedEntities] = React.useState<string[]>([]);

  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => {
      const status = activeTab.toLowerCase();
      if (status !== 'all') {
        let docStatus = doc.status.toLowerCase().replace(' ', '');
        if (docStatus === 'expiringsoon') docStatus = 'expiring';
        if (docStatus !== status) return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(doc.category)) {
        return false;
      }
      
      if (selectedEntities.length > 0 && !selectedEntities.includes(doc.entityName)) {
        return false;
      }

      return true;
    });
  }, [activeTab, selectedCategories, selectedEntities]);

  const handleCategoryFilterChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };
  
  const handleEntityFilterChange = (entity: string, checked: boolean) => {
    setSelectedEntities(prev => 
      checked ? [...prev, entity] : prev.filter(e => e !== entity)
    );
  };

  const renderDocumentList = (docs: Document[]) => (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          Manage all employee and company documents and track their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Entity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Expiry Date
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length > 0 ? docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{doc.entityName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={
                      doc.status === "Active"
                        ? "secondary"
                        : doc.status === "Expiring Soon"
                        ? "default"
                        : "destructive"
                    }
                    className={
                      doc.status === "Expiring Soon"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {doc.expiryDate
                    ? format(new Date(doc.expiryDate), "PPP")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                   <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    disabled={doc.status === "Active"}
                    onClick={() => setRenewalDocument(doc)}
                  >
                    Renew
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{docs.length}</strong> document(s).
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Documents</h1>
      </div>
      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as Status)}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="expired" className="hidden sm:flex">
              Expired
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <UserSearch className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter by Entity
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Entity/Employee</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {documentEntities.map((entity) => (
                  <DropdownMenuCheckboxItem 
                    key={entity.id}
                    checked={selectedEntities.includes(entity.name)}
                    onCheckedChange={(checked) => handleEntityFilterChange(entity.name, !!checked)}
                  >
                    {entity.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter by Category
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {documentCategories.map((cat) => (
                  <DropdownMenuCheckboxItem 
                    key={cat.id}
                    checked={selectedCategories.includes(cat.name)}
                    onCheckedChange={(checked) => handleCategoryFilterChange(cat.name, !!checked)}
                  >
                    {cat.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <DocumentUploadDialog />
          </div>
        </div>
        <TabsContent value="all">{renderDocumentList(filteredDocuments)}</TabsContent>
        <TabsContent value="active">{renderDocumentList(filteredDocuments)}</TabsContent>
        <TabsContent value="expiring">{renderDocumentList(filteredDocuments)}</TabsContent>
        <TabsContent value="expired">{renderDocumentList(filteredDocuments)}</TabsContent>
      </Tabs>
      <DocumentDetailDialog
        isOpen={!!selectedDocument}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedDocument(null)
          }
        }}
        document={selectedDocument}
      />
       <DocumentRenewalDialog
        isOpen={!!renewalDocument}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setRenewalDocument(null)
          }
        }}
        document={renewalDocument}
      />
    </>
  )
}

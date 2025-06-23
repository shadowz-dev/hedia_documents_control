"use client"

import * as React from "react"
import { File, ListFilter, Building2, User } from "lucide-react"
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
import { documents, documentCategories, documentCompanies, documentPersons, type Document } from "@/lib/data"
import { DocumentUploadDialog } from "./document-upload-dialog"
import { DocumentDetailDialog } from "./document-detail-dialog"
import { DocumentRenewalDialog } from "./document-renewal-dialog"

type Status = "all" | "active" | "expiring" | "expired"

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [renewalDocument, setRenewalDocument] = React.useState<Document | null>(null);

  const [activeTab, setActiveTab] = React.useState<Status>("all");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([]);
  const [selectedPersons, setSelectedPersons] = React.useState<string[]>([]);

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
      
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(doc.companyName)) {
        return false;
      }

      if (selectedPersons.length > 0 && !selectedPersons.includes(doc.personName)) {
        return false;
      }

      return true;
    });
  }, [activeTab, selectedCategories, selectedCompanies, selectedPersons]);

  const handleCategoryFilterChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };
  
 const handleCompanyFilterChange = (company: string, checked: boolean) => {
    setSelectedCompanies(prev => 
      checked ? [...prev, company] : prev.filter(c => c !== company)
    );
  };

  const handlePersonFilterChange = (person: string, checked: boolean) => {
    setSelectedPersons(prev => 
      checked ? [...prev, person] : prev.filter(p => p !== person)
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
              <TableHead className="hidden sm:table-cell">Company</TableHead>
              <TableHead className="hidden md:table-cell">Person</TableHead>
              <TableHead>Document Name</TableHead>
              <TableHead className="hidden lg:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">
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
                <TableCell className="hidden sm:table-cell font-medium">{doc.companyName}</TableCell>
                <TableCell className="hidden md:table-cell font-medium">{doc.personName}</TableCell>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline">{doc.category}</Badge>
                </TableCell>
                <TableCell>
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
                <TableCell className="hidden lg:table-cell">
                  {doc.expiryDate
                    ? format(new Date(doc.expiryDate), "PPP")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
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
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter by Company
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {documentCompanies.map((company) => (
                  <DropdownMenuCheckboxItem 
                    key={company.id}
                    checked={selectedCompanies.includes(company.name)}
                    onCheckedChange={(checked) => handleCompanyFilterChange(company.name, !!checked)}
                  >
                    {company.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter by Person
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Person</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {documentPersons.map((person) => (
                  <DropdownMenuCheckboxItem 
                    key={person.id}
                    checked={selectedPersons.includes(person.name)}
                    onCheckedChange={(checked) => handlePersonFilterChange(person.name, !!checked)}
                  >
                    {person.name}
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


"use client"

import * as React from "react"
import { File, ListFilter, Building2, User } from "lucide-react"
import { format, getYear, getMonth } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

import { documents, documentCategories, documentCompanies, documentPersons, type Document } from "@/lib/data"

const months = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: format(new Date(0, i), "MMMM"),
}))

const years = Array.from({ length: 10 }, (_, i) =>
  (getYear(new Date()) - i).toString()
)

const chartConfig = {
  cost: {
    label: "Cost (AED)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ReportsPage() {
  // State for filters
  const [dateFilterType, setDateFilterType] = React.useState("range");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedMonth, setSelectedMonth] = React.useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([]);
  const [selectedPersons, setSelectedPersons] = React.useState<string[]>([]);

  // State for report data
  const [filteredDocuments, setFilteredDocuments] = React.useState<Document[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);

  const handleGenerateReport = () => {
    let filtered = [...documents];

    // Filter by date
    if (dateFilterType === "range" && dateRange?.from) {
      filtered = filtered.filter((doc) => {
        const uploadDate = new Date(doc.uploadDate);
        if (dateRange.to) {
          return uploadDate >= dateRange.from! && uploadDate <= dateRange.to;
        }
        return uploadDate >= dateRange.from!;
      });
    } else if (dateFilterType === "monthly") {
      const month = parseInt(selectedMonth, 10) - 1;
      const year = parseInt(selectedYear, 10);
      filtered = filtered.filter(doc => {
        const uploadDate = new Date(doc.uploadDate);
        return getMonth(uploadDate) === month && getYear(uploadDate) === year;
      });
    } else if (dateFilterType === "annually") {
      const year = parseInt(selectedYear, 10);
      filtered = filtered.filter(doc => {
        const uploadDate = new Date(doc.uploadDate);
        return getYear(uploadDate) === year;
      });
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      const categoryNames = documentCategories
        .filter(c => selectedCategories.includes(c.id))
        .map(c => c.name);
      filtered = filtered.filter(doc => categoryNames.includes(doc.category));
    }
    
    // Filter by companies
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(doc => selectedCompanies.includes(doc.companyName));
    }
    
    // Filter by persons
    if (selectedPersons.length > 0) {
      filtered = filtered.filter(doc => selectedPersons.includes(doc.personName));
    }

    setFilteredDocuments(filtered);
    
    const categoryCosts = filtered.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = 0;
      }
      acc[doc.category] += doc.cost;
      return acc;
    }, {} as { [key: string]: number });

    setChartData(Object.entries(categoryCosts).map(([category, cost]) => ({ name: category, cost })));
  };
  
  const handleCategoryFilterChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
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
          <CardTitle>Generate Document Report</CardTitle>
          <CardDescription>
            Use the filters below to generate a report, including a visual chart.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:items-end">
             <div className="grid gap-2">
                <Label>Date Filter Type</Label>
                <Select value={dateFilterType} onValueChange={setDateFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="range">Date Range</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
             </div>

             {dateFilterType === 'range' && (
                <div className="grid gap-2">
                  <Label>Date range</Label>
                  <DatePicker
                    mode="range"
                    value={dateRange}
                    onChange={(range) =>
                      setDateRange(range as DateRange | undefined)
                    }
                    placeholder="Select a date range"
                  />
                </div>
              )}
             
              {dateFilterType === 'monthly' && (
                <>
                  <div className="grid gap-2">
                    <Label>Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="grid gap-2">
                    <Label>Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                         {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                       </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {dateFilterType === 'annually' && (
                 <div className="grid gap-2">
                  <Label>Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                       {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                     </SelectContent>
                  </Select>
                </div>
              )}
              
             <div className="grid gap-2">
              <Label>Company</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    <Building2 className="mr-2 h-4 w-4" />
                     {selectedCompanies.length > 0 ? `${selectedCompanies.length} selected` : "Filter by Company"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
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
             </div>
             
             <div className="grid gap-2">
              <Label>Person</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    <User className="mr-2 h-4 w-4" />
                    {selectedPersons.length > 0 ? `${selectedPersons.length} selected` : "Filter by Person"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
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
             </div>
             
             <div className="grid gap-2">
              <Label>Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    <ListFilter className="mr-2 h-4 w-4" />
                     {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Filter by Category"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {documentCategories.map((cat) => (
                    <DropdownMenuCheckboxItem 
                      key={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={(checked) => handleCategoryFilterChange(cat.id, !!checked)}
                    >
                      {cat.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
             </div>

            <Button className="self-end" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
          
          {filteredDocuments.length > 0 && chartData.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Report Summary: Cost by Category</CardTitle>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={chartData} accessibilityLayer>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `AED ${value}`} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                              <div className="font-medium">{label}</div>
                              <div className="grid gap-1.5">
                                <div className="flex w-full items-center gap-2">
                                  <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                                  <div className="flex flex-1 justify-between leading-none">
                                    <span className="text-muted-foreground">Cost</span>
                                    <span className="font-mono font-medium tabular-nums text-foreground">
                                      AED {payload[0].value.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          <div className="mt-6">
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Person</TableHead>
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
                        <TableCell className="font-medium">{doc.companyName}</TableCell>
                        <TableCell className="font-medium">{doc.personName}</TableCell>
                        <TableCell>{doc.name}</TableCell>
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
                          AED {doc.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No documents found for the selected filters. Generate a report to see results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

    
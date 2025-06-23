
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  FileClock,
} from "lucide-react"
import { format, addMonths, getMonth, getYear } from "date-fns"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { documents } from "@/lib/data"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [renewalData, setRenewalData] = useState<any[]>([])
  const [annualCost, setAnnualCost] = useState(0);
  const [expiringNextMonth, setExpiringNextMonth] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();

    // Calculate renewal costs for the next 6 months
    const renewalCosts = [];
    for (let i = 0; i < 6; i++) {
      const targetMonthDate = addMonths(now, i);
      const targetMonth = getMonth(targetMonthDate);
      const targetYear = getYear(targetMonthDate);
      
      const monthlyTotal = documents
        .filter(doc => {
          if (!doc.expiryDate) return false;
          const expiryDate = new Date(doc.expiryDate);
          return getMonth(expiryDate) === targetMonth && getYear(expiryDate) === targetYear;
        })
        .reduce((sum, doc) => sum + doc.cost, 0);

      renewalCosts.push({
        month: format(targetMonthDate, 'MMM'),
        total: monthlyTotal,
      });
    }
    setRenewalData(renewalCosts);

    // Calculate total annual cost
    const totalAnnualCost = documents.reduce((sum, doc) => sum + doc.cost, 0);
    setAnnualCost(totalAnnualCost);

    // Get documents expiring next month
    const upcomingMonth = addMonths(now, 1);
    const startOfUpcomingMonth = new Date(getYear(upcomingMonth), getMonth(upcomingMonth), 1);
    const endOfUpcomingMonth = new Date(getYear(upcomingMonth), getMonth(upcomingMonth) + 1, 0);
    
    const expiringDocs = documents.filter(doc => {
      if (!doc.expiryDate) return false;
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate >= startOfUpcomingMonth && expiryDate <= endOfUpcomingMonth;
    });
    setExpiringNextMonth(expiringDocs);

  }, []);


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,257</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expiring Soon
            </CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{expiringNextMonth.length}</div>
            <p className="text-xs text-muted-foreground">
              in the next month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Costs</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 1,205.32</div>
            <p className="text-xs text-muted-foreground">
              -5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Cost</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {annualCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total estimated annual cost
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Renewal Cost Forecast</CardTitle>
            <CardDescription>
              Estimated renewal costs for the next 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={renewalData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `AED ${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                          <div className="font-medium">{label}</div>
                          <div className="grid gap-1.5">
                            {payload.map((item) => (
                              <div key={item.dataKey} className="flex w-full items-center gap-2">
                                 <div
                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                    style={{ backgroundColor: item.color }}
                                  />
                                <div className="flex flex-1 justify-between leading-none">
                                  <span className="text-muted-foreground">
                                    Total
                                  </span>
                                  <span className="font-mono font-medium tabular-nums text-foreground">
                                    AED {item.value.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Documents Expiring Next Month</CardTitle>
              <CardDescription>
                These documents require renewal next month.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/documents">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {expiringNextMonth.length > 0 ? expiringNextMonth.map(doc => (
            <div className="flex items-center gap-4" key={doc.id}>
              <Avatar className="hidden h-9 w-9 sm:flex">
                 <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {doc.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires on {format(new Date(doc.expiryDate), "PPP")}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <Badge variant="destructive">Renewal Due</Badge>
              </div>
            </div>
            )) : (
              <p className="text-sm text-muted-foreground">No documents expiring next month.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

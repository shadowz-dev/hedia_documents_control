"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  FileClock,
} from "lucide-react"
import { format } from "date-fns"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { expiringSoon, recentActivity } from "@/lib/data"
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [costData, setCostData] = useState<any[]>([])

  useEffect(() => {
    // Using a static seed for Math.random for consistent data generation
    // This is a simplified approach. For true consistency, data should be fetched
    // or defined statically.
    const generateConsistentRandom = (seed: number) => {
        let state = seed;
        return () => {
            state = (state * 9301 + 49297) % 233280;
            return state / 233280;
        };
    };
    
    const random = generateConsistentRandom(1);

    const generatedCostData = [
      { month: 'Jan', total: Math.floor(random() * 4000) + 1000 },
      { month: 'Feb', total: Math.floor(random() * 4000) + 1000 },
      { month: 'Mar', total: Math.floor(random() * 4000) + 1000 },
      { month: 'Apr', total: Math.floor(random() * 4000) + 1000 },
      { month: 'May', total: Math.floor(random() * 4000) + 1000 },
      { month: 'Jun', total: Math.floor(random() * 4000) + 1000 },
    ];
    setCostData(generatedCostData);
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
              +20.1% from last month
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
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              in the next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Costs</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,205.32</div>
            <p className="text-xs text-muted-foreground">
              -5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">
              +1 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>
              Monthly costs for document renewals and fees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={costData}>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Documents Expiring Soon</CardTitle>
              <CardDescription>
                These documents need your attention for renewal.
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
            {expiringSoon.map(doc => (
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
                <Badge variant="destructive">Expiring</Badge>
              </div>
            </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  value?: Date | DateRange
  onChange?: (date?: Date | DateRange) => void
  placeholder?: string
  mode?: "single" | "range"
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  mode = "single",
  className,
}: DatePickerProps) {
  const displayContent = () => {
    if (mode === "range" && value && typeof value === "object" && "from" in value) {
      const range = value as DateRange
      if (range.from && range.to) {
        return `${format(range.from, "LLL dd, y")} - ${format(
          range.to,
          "LLL dd, y"
        )}`
      }
      if (range.from) {
        return format(range.from, "LLL dd, y")
      }
    }
    if (mode === "single" && value instanceof Date) {
      return format(value, "PPP")
    }
    return <span>{placeholder}</span>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayContent()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode={mode}
          selected={value as any}
          onSelect={onChange as any}
          numberOfMonths={mode === "range" ? 2 : 1}
        />
      </PopoverContent>
    </Popover>
  )
}

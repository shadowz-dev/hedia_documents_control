import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Calendar</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document & Appointment Calendar</CardTitle>
          <CardDescription>
            View all important dates, renewal deadlines, and scheduled appointments.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    </>
  )
}

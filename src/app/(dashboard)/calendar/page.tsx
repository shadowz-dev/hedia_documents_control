
"use client"

import * as React from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { Calendar as CalendarIcon, FileClock, PlusCircle, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { appointments, documents, type Appointment, type Document } from "@/lib/data"
import { AddAppointmentDialog } from "./add-appointment-dialog"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false)

  const eventDates = React.useMemo(() => {
    const docExpiryDates = documents
      .filter(doc => doc.expiryDate)
      .map(doc => parseISO(doc.expiryDate!))

    const appointmentDates = appointments.map(appt => parseISO(appt.date))

    return [...docExpiryDates, ...appointmentDates]
  }, [])

  const selectedDayEvents = React.useMemo(() => {
    if (!selectedDate) {
      return { expiringDocs: [], dayAppointments: [] }
    }

    const expiringDocs = documents.filter(
      doc => doc.expiryDate && isSameDay(parseISO(doc.expiryDate), selectedDate)
    )

    const dayAppointments = appointments.filter(appt =>
      isSameDay(parseISO(appt.date), selectedDate)
    )

    return { expiringDocs, dayAppointments }
  }, [selectedDate])

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Calendar</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Document & Appointment Calendar</CardTitle>
            <CardDescription>
              View all important dates and scheduled appointments.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{ hasEvent: eventDates }}
              modifiersClassNames={{
                hasEvent: "rdp-day_has_event",
              }}
            />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 translate-y-px shrink-0 rounded-full bg-primary" />
                <span>Indicates a document expiry or an appointment.</span>
             </div>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedDate ? format(selectedDate, "PPP") : "Select a Date"}
                </CardTitle>
                <CardDescription>Events for this day.</CardDescription>
              </div>
              {selectedDate && (
                 <Button size="sm" className="h-8 gap-1" onClick={() => setAddDialogOpen(true)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Event
                    </span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {selectedDate ? (
              <>
                {selectedDayEvents.dayAppointments.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Appointments</h3>
                    <div className="space-y-3">
                      {selectedDayEvents.dayAppointments.map((appt: Appointment) => (
                        <div key={appt.id} className="flex items-start gap-3">
                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                             <Video className="h-5 w-5" />
                           </div>
                           <div>
                            <p className="font-medium">{appt.title}</p>
                            <p className="text-sm text-muted-foreground">{appt.time} - {appt.description}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                 {selectedDayEvents.expiringDocs.length > 0 && selectedDayEvents.dayAppointments.length > 0 && <Separator />}
                 {selectedDayEvents.expiringDocs.length > 0 && (
                   <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Document Renewals</h3>
                     <div className="space-y-3">
                      {selectedDayEvents.expiringDocs.map((doc: Document) => (
                        <div key={doc.id} className="flex items-start gap-3">
                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                            <FileClock className="h-5 w-5" />
                           </div>
                           <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">{doc.personName !== 'N/A' ? doc.personName : doc.companyName}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDayEvents.expiringDocs.length === 0 && selectedDayEvents.dayAppointments.length === 0 && (
                   <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
                     <CalendarIcon className="h-12 w-12 mb-2" />
                     <p>No events scheduled for this day.</p>
                   </div>
                )}
              </>
            ) : (
               <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
                 <CalendarIcon className="h-12 w-12 mb-2" />
                 <p>Select a date on the calendar to see events.</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedDate && (
        <AddAppointmentDialog 
          isOpen={isAddDialogOpen} 
          onOpenChange={setAddDialogOpen} 
          selectedDate={selectedDate}
        />
      )}
    </>
  )
}

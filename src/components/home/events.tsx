"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const year = 2025;
const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

const eventsByMonth = {
    November: [
        "November 18-20, 2025 - November Market Fever",
        "November 25, 2025 - Community Meeting",
    ],
    December: [
        "December 15, 2025 - Parol Making Contest",
        "December 23, 2025 - Distribution of Gifts among Children",
        "December 28, 2025 - Mrs. and Mr. Rivera Wedding Venue",
        "December 30, 2025 - Community Party",
    ],
};

export function Events() {
  const calendarClassNames = {
      month: 'space-y-2',
      caption: 'flex justify-center pt-1 relative items-center',
      caption_label: "text-sm font-medium",
      nav: "hidden",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-6 font-normal text-[0.7rem]",
      row: "flex w-full mt-1",
      cell: "h-6 w-6 text-center text-xs p-0 relative",
      day: "h-6 w-6 p-0 font-normal rounded-full flex items-center justify-center aria-selected:opacity-100",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "text-muted-foreground opacity-50",
      day_disabled: "text-muted-foreground opacity-50",
  }

  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Events</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            This calendar outlines the scheduled events at the Bakakeng Central Basketball Court
          </p>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-10 gap-12">
            {/* Calendar */}
            <div className="lg:col-span-6 flex items-start justify-center">
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {months.map((month, index) => (
                         <Card key={index} className="p-2">
                             <Calendar
                                mode="single"
                                month={month}
                                className="rounded-md text-xs"
                                classNames={calendarClassNames}
                            />
                         </Card>
                    ))}
                 </div>
            </div>
            
            {/* Events List */}
            <div className="lg:col-span-4">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-primary font-headline">November 2025</h3>
                        <Separator className="my-2 bg-primary/50" />
                        <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                            {eventsByMonth.November.map((event, index) => (
                                <li key={index}>{event}</li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold text-primary font-headline">December 2025</h3>
                         <Separator className="my-2 bg-primary/50" />
                        <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                             {eventsByMonth.December.map((event, index) => (
                                <li key={index}>{event}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

"use client"
import * as React from "react"
import { startOfMonth } from "date-fns"

import { Calendar } from "@/components/ui/calendar"

const events = [
  new Date(new Date().getFullYear(), new Date().getMonth(), 8),
  new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 22),
  new Date(new Date().getFullYear(), new Date().getMonth() + 4, 2),
];

export function Events() {
  const [currentDate] = React.useState(new Date())
  const firstMonth = startOfMonth(new Date(currentDate.getFullYear(), 0, 1));

  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="w-full flex flex-col items-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Events Calendar</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stay up-to-date with all the happenings in our barangay for the entire year.
            </p>
        </div>

        <div className="w-full max-w-screen-2xl">
            <Calendar
                numberOfMonths={12}
                month={firstMonth}
                modifiers={{ highlighted: events }}
                modifiersClassNames={{
                    highlighted: 'bg-primary text-primary-foreground rounded-full',
                }}
                onMonthChange={() => {}}
                className="p-0"
                classNames={{
                    months: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4',
                    month: 'border bg-card text-card-foreground shadow-sm rounded-lg p-3 w-full',
                    caption_label: "font-headline",
                    nav_button: "hidden",
                }}
            />
        </div>
      </div>
    </section>
  )
}

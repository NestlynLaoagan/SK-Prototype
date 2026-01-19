"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock events data for demonstration
const events = [
  new Date(new Date().getFullYear(), new Date().getMonth(), 8),
  new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 22),
  new Date(new Date().getFullYear(), new Date().getMonth() + 4, 2),
  new Date(new Date().getFullYear() + 1, 2, 15),
];

export function Events() {
  const [year, setYear] = React.useState(new Date().getFullYear());

  const yearEvents = events.filter(d => d.getFullYear() === year);

  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Events Calendar</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Stay up-to-date with all the happenings in our barangay for the entire year.
          </p>
        </div>

        <div className="w-full max-w-screen-2xl flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setYear(year - 1)}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous year</span>
            </Button>
            <h3 className="text-2xl font-bold font-headline">{year}</h3>
            <Button variant="outline" size="icon" onClick={() => setYear(year + 1)}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next year</span>
            </Button>
          </div>

          <Calendar
            numberOfMonths={12}
            month={new Date(year, 0, 1)}
            modifiers={{ highlighted: yearEvents }}
            modifiersClassNames={{
              highlighted: 'bg-primary text-primary-foreground',
            }}
            onMonthChange={() => {}}
            className="p-0 w-full"
            classNames={{
              months: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full',
              month: 'border bg-card text-card-foreground shadow-md rounded-xl p-4 space-y-4',
              caption: 'flex items-center justify-center relative mb-4',
              caption_label: "text-xl font-headline font-semibold",
              nav: "hidden", // We use custom navigation
              table: "w-full border-collapse",
              head_row: "flex justify-around items-center",
              head_cell: "w-10 text-center text-sm font-medium text-muted-foreground",
              row: "flex justify-around mt-2",
              cell: "w-10 h-10 p-0 text-center flex items-center justify-center",
              day: "w-10 h-10 rounded-full hover:bg-accent transition-colors flex items-center justify-center",
              day_today: "bg-accent text-accent-foreground font-bold",
              day_outside: "text-muted-foreground/50",
            }}
          />
        </div>
      </div>
    </section>
  )
}

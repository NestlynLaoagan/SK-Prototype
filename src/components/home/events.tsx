"use client"
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
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

  const calendarClassNames = {
      months: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full',
      month: 'border bg-card text-card-foreground shadow-md rounded-xl p-4 space-y-4',
      caption: 'flex items-center justify-center relative mb-4',
      caption_label: "text-xl font-headline font-semibold",
      nav: "hidden",
      table: "w-full border-collapse",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: "h-9 w-9 text-center text-sm p-0 relative",
      day: "h-9 w-9 p-0 font-normal rounded-full aria-selected:opacity-100 transition-colors hover:bg-accent/50",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "text-muted-foreground opacity-50",
      day_disabled: "text-muted-foreground opacity-50",
      day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
  }


  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Events Calendar</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Stay up-to-date with all the happenings in our barangay for the entire year.
          </p>
        </div>

        <div className="w-full max-w-screen-xl flex flex-col items-center gap-6">
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

          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Calendar
                  numberOfMonths={6}
                  month={new Date(year, 0, 1)}
                  modifiers={{ highlighted: yearEvents }}
                  modifiersClassNames={{
                    highlighted: 'bg-primary text-primary-foreground',
                  }}
                  onMonthChange={() => {}}
                  className="p-0 w-full"
                  classNames={calendarClassNames}
                />
              </CarouselItem>
              <CarouselItem>
                <Calendar
                  numberOfMonths={6}
                  month={new Date(year, 6, 1)}
                  modifiers={{ highlighted: yearEvents }}
                  modifiersClassNames={{
                    highlighted: 'bg-primary text-primary-foreground',
                  }}
                  onMonthChange={() => {}}
                  className="p-0 w-full"
                  classNames={calendarClassNames}
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 md:-left-12" />
            <CarouselNext className="absolute right-0 md:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

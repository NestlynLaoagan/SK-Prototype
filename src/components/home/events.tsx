"use client"
import * as React from "react"
import { startOfMonth } from "date-fns"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
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
  const seventhMonth = startOfMonth(new Date(currentDate.getFullYear(), 6, 1));

  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container flex flex-col items-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Events Calendar</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stay up-to-date with all the happenings in our barangay.
            </p>
        </div>

        <Carousel className="w-full max-w-6xl">
          <CarouselContent>
            <CarouselItem className="flex justify-center">
                <Calendar
                    numberOfMonths={6}
                    month={firstMonth}
                    modifiers={{ highlighted: events }}
                    modifiersClassNames={{
                        highlighted: 'bg-primary text-primary-foreground rounded-full',
                    }}
                    onMonthChange={() => {}}
                    className="p-0"
                    classNames={{
                        months: 'flex flex-wrap gap-4 justify-center',
                        month: 'border bg-card text-card-foreground shadow-sm rounded-lg p-3 w-full sm:w-auto',
                        caption_label: "font-headline",
                    }}
                />
            </CarouselItem>
            <CarouselItem className="flex justify-center">
                 <Calendar
                    numberOfMonths={6}
                    month={seventhMonth}
                    modifiers={{ highlighted: events }}
                    modifiersClassNames={{
                        highlighted: 'bg-primary text-primary-foreground rounded-full',
                    }}
                    onMonthChange={() => {}}
                    className="p-0"
                    classNames={{
                        months: 'flex flex-wrap gap-4 justify-center',
                        month: 'border bg-card text-card-foreground shadow-sm rounded-lg p-3 w-full sm:w-auto',
                        caption_label: "font-headline",
                    }}
                />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  )
}

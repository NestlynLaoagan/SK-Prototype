"use client"
import * as React from "react"
import { addMonths, format, startOfMonth } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "../ui/card"


const events = [
  new Date(new Date().getFullYear(), new Date().getMonth(), 8),
  new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 22),
  new Date(new Date().getFullYear(), new Date().getMonth() + 4, 2),
];

export function Events() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const firstHalfMonths = Array.from({ length: 6 }, (_, i) => addMonths(startOfMonth(new Date(currentDate.getFullYear(), 0, 1)), i));
  const secondHalfMonths = Array.from({ length: 6 }, (_, i) => addMonths(startOfMonth(new Date(currentDate.getFullYear(), 6, 1)), i));

  const renderCalendarGrid = (months: Date[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {months.map((month) => (
        <Card key={month.toString()}>
          <CardContent className="p-2">
            <Calendar
                month={month}
                modifiers={{ highlighted: events }}
                modifiersClassNames={{
                    highlighted: 'bg-primary text-primary-foreground rounded-full',
                }}
                className="p-0"
                classNames={{
                    caption_label: "font-headline",
                }}
                onMonthChange={(m) => {}} // prevent month change within calendar
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )

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
            <CarouselItem>
                {renderCalendarGrid(firstHalfMonths)}
            </CarouselItem>
            <CarouselItem>
                {renderCalendarGrid(secondHalfMonths)}
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  )
}

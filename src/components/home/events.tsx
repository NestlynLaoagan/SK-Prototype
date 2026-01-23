"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const year = 2026;
const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
const monthGroups = [
    months.slice(0, 6),
    months.slice(6, 12)
];
const monthRanges = ["January - June 2026", "July - December 2026"];

const eventsByMonth: Record<string, { date: string, name: string }[]> = {
    "November 2025": [
        { date: "November 18-20, 2025", name: "November Market Fever" },
        { date: "November 25, 2025", name: "Community Meeting" },
    ],
    "December 2025": [
        { date: "December 15, 2025", name: "Parol Making Contest" },
        { date: "December 23, 2025", name: "Distribution of Gifts among Children" },
        { date: "December 28, 2025", name: "Mrs. and Mr. Rivera Wedding Venue" },
        { date: "December 30, 2025", name: "Community Party" },
    ],
};

export function Events() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
        api?.scrollNext()
    }, [api])

    const calendarClassNames = {
        month: 'space-y-2',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: "text-sm font-medium w-full bg-primary/80 text-primary-foreground py-2 rounded-t-md text-center",
        nav: "hidden",
        table: "w-full border-collapse space-y-1 p-2",
        head_row: "flex justify-around",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2 justify-around",
        cell: "h-8 w-8 text-center text-sm p-0 relative",
        day: "h-8 w-8 p-0 font-normal rounded-full flex items-center justify-center aria-selected:opacity-100",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
    }

    return (
        <section id="events" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Events</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        This calendar outlines the scheduled events at the Bakakeng Central Basketball Court
                    </p>
                </div>

                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-12">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-7">
                        <Carousel setApi={setApi} className="w-full">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Button variant="ghost" size="icon" onClick={scrollPrev} className="rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-50">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <span className="text-lg font-semibold w-48 text-center">{monthRanges[current]}</span>
                                <Button variant="ghost" size="icon" onClick={scrollNext} className="rounded-full bg-primary/80 text-primary-foreground hover:bg-primary/70 disabled:opacity-50">
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </div>
                            <CarouselContent>
                                {monthGroups.map((group, groupIndex) => (
                                    <CarouselItem key={groupIndex}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {group.map((month, monthIndex) => (
                                                <Card key={monthIndex} className="shadow-md">
                                                    <Calendar
                                                        month={month}
                                                        className="p-0"
                                                        classNames={calendarClassNames}
                                                    />
                                                </Card>
                                            ))}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                             <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => api?.scrollTo(index)}
                                        className={`h-3 w-3 rounded-full transition-colors ${current === index ? 'bg-primary/80' : 'bg-muted'}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </Carousel>
                    </div>

                    {/* Events List */}
                    <div className="lg:col-span-3">
                        <div className="space-y-8">
                           {Object.entries(eventsByMonth).map(([month, events]) => (
                                <div key={month}>
                                    <h3 className="text-2xl font-bold text-primary/80 font-headline">{month}</h3>
                                    <ul className="mt-2 space-y-2 list-none text-muted-foreground">
                                        {events.map((event, index) => (
                                            <li key={index} className="text-sm">
                                                {event.date} - <span className="font-bold">{event.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

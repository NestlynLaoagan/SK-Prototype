"use client"
import React, { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { format } from 'date-fns'


const year = 2026;
const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

const eventsByMonth: Record<string, { date: Date, name: string }[]> = {
    "January": [
        { date: new Date("2026-01-10"), name: "New Year Community Cleanup" },
    ],
    "February": [
        { date: new Date("2026-02-14"), name: "Valentine's Day Bazaar" },
    ],
    "March": [
        { date: new Date("2026-03-22"), name: "Sports Fest Opening" },
    ],
    "April": [
        { date: new Date("2026-04-09"), name: "Day of Valor Ceremony" },
    ],
    "May": [
        { date: new Date("2026-05-01"), name: "Labor Day Job Fair" },
    ],
    "June": [
        { date: new Date("2026-06-12"), name: "Independence Day Celebration" },
    ],
    "July": [
        { date: new Date("2026-07-20"), name: "Community Meeting" },
    ],
    "August": [
        { date: new Date("2026-08-31"), name: "National Heroes Day" },
    ],
    "September": [
        { date: new Date("2026-09-05"), name: "Barangay-wide Cleanup Drive" },
    ],
    "October": [
        { date: new Date("2026-10-28"), name: "Barangay Assembly Day" },
    ],
    "November": [
        { date: new Date("2026-11-15"), name: "Free Anti-Rabies Vaccination" },
        { date: new Date("2026-11-30"), name: "Bonifacio Day" },
    ],
    "December": [
        { date: new Date("2026-12-15"), name: "Parol Making Contest" },
        { date: new Date("2026-12-25"), name: "Christmas Community Party" },
        { date: new Date("2026-12-30"), name: "Rizal Day" },
    ]
};

const allEventDays = Object.values(eventsByMonth).flat().map(event => event.date);

export function Events() {
    const [isClient, setIsClient] = useState(false);
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [dateRange, setDateRange] = useState("")

    useEffect(() => {
        setIsClient(true);
    }, []);

    const monthChunks = React.useMemo(() => {
        const chunks = [];
        for (let i = 0; i < months.length; i += 6) {
            chunks.push(months.slice(i, i + 6));
        }
        return chunks;
    }, []);

    const updateDateRange = React.useCallback((index: number) => {
        if (!monthChunks[index]) return;
        const startMonth = monthChunks[index][0];
        const endMonth = monthChunks[index][monthChunks[index].length - 1];
        setDateRange(`${format(startMonth, "MMMM")} - ${format(endMonth, "MMMM")} ${year}`);
    }, [monthChunks]);

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())
        updateDateRange(api.selectedScrollSnap())

        api.on("select", () => {
            const currentSnap = api.selectedScrollSnap()
            setCurrent(currentSnap)
            updateDateRange(currentSnap)
        })
    }, [api, updateDateRange])


    const calendarClassNames = {
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: "text-sm font-medium uppercase bg-primary/90 text-primary-foreground py-2 px-4 rounded-t-md",
        nav: "hidden",
        table: "w-full border-collapse",
        head_row: "", // Use default table display
        head_cell: "text-muted-foreground w-9 font-normal text-[0.8rem]",
        row: "", // Use default table display
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: "h-8 w-8 p-0 font-normal rounded-full inline-flex items-center justify-center",
        day_selected: "bg-primary/90 text-primary-foreground rounded-full",
        day_today: "bg-accent text-accent-foreground rounded-full",
        day_outside: "text-muted-foreground opacity-50 hidden",
        day_disabled: "text-muted-foreground opacity-50",
    }
    
    const modifiers = {
        event: allEventDays,
    };
    
    const modifiersClassNames = {
        event: 'bg-primary text-primary-foreground rounded-full',
    };

    const listedEvents = Object.entries(eventsByMonth).filter(([, events]) => events.length > 0);

    return (
        <section id="events" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Events</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        This calendar outlines the scheduled events at the Bakakeng Central Basketball Court.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                    {isClient ? (
                        <div className="w-full flex flex-col items-center lg:col-span-3">
                            <Carousel setApi={setApi} className="w-full">
                                 <div className="flex items-center justify-center relative mb-4">
                                    <CarouselPrevious className="absolute left-0 -translate-x-8 bg-primary text-primary-foreground rounded-full" />
                                    <div className="py-1 text-center text-lg font-medium">{dateRange}</div>
                                    <CarouselNext className="absolute right-0 translate-x-8 bg-primary text-primary-foreground rounded-full" />
                                </div>
                                <CarouselContent>
                                    {monthChunks.map((chunk, index) => (
                                        <CarouselItem key={index}>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                                                {chunk.map((month) => (
                                                    <Card key={month.toISOString()}>
                                                        <Calendar
                                                            month={month}
                                                            showOutsideDays={false}
                                                            className="p-3"
                                                            classNames={calendarClassNames}
                                                            modifiers={modifiers}
                                                            modifiersClassNames={modifiersClassNames}
                                                            components={{
                                                                CaptionLabel: ({ displayMonth }) => (
                                                                    <div className={calendarClassNames.caption_label}>{format(displayMonth, "MMMM").toUpperCase()}</div>
                                                                ),
                                                            }}
                                                        />
                                                    </Card>
                                                ))}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                             <div className="flex justify-center gap-2 mt-4">
                                {Array.from({ length: count }).map((_, index) => (
                                    <button key={index} onClick={() => api?.scrollTo(index)} className={`h-2 w-2 rounded-full transition-colors ${index === current ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'}`} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="w-full h-[600px] lg:col-span-3" />
                    )}

                    <div className="space-y-8 lg:col-span-1">
                        {listedEvents.map(([month, events]) => (
                            <div key={month}>
                                <h3 className="text-2xl font-bold text-primary mb-4">{month} {year}</h3>
                                <div className="space-y-4">
                                    {events.map((event, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="text-center bg-primary text-primary-foreground rounded-lg p-2 w-20 flex-shrink-0">
                                                <span className="block text-sm font-bold uppercase">{format(event.date, "MMM")}</span>
                                                <span className="block text-2xl font-bold">{format(event.date, "d")}</span>
                                            </div>
                                            <p className="font-medium">{event.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

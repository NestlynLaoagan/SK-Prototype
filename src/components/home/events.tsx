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
        month: 'space-y-2',
        caption: 'flex justify-center relative items-center px-1 pb-2',
        caption_label: "text-sm font-medium uppercase bg-accent text-accent-foreground text-center py-2 px-4 rounded-md w-full",
        nav: "hidden",
        table: "w-full border-collapse",
        head_row: "",
        head_cell: "text-muted-foreground font-normal text-[0.8rem] w-8 pb-1 text-center",
        row: "w-full",
        cell: "text-center text-sm p-0",
        day: "h-8 w-8 p-0 font-normal rounded-full inline-flex items-center justify-center hover:bg-accent",
        day_selected: "bg-primary text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "opacity-0 select-none",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: 'invisible',
    }
    
    const modifiers = {
        event: allEventDays,
    };
    
    const modifiersClassNames = {
        event: 'bg-primary text-primary-foreground',
    };

    return (
        <section id="events" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Events</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        This calendar outlines the scheduled events at the Bakakeng Central Basketball Court.
                    </p>
                </div>
                
                <div className="w-full max-w-5xl mx-auto">
                    {isClient ? (
                        <div className="w-full flex flex-col items-center">
                            <Carousel setApi={setApi} className="w-full">
                                 <div className="flex items-center justify-center relative mb-4">
                                    <CarouselPrevious className="absolute left-0 -translate-x-12 bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground" />
                                    <div className="py-1 text-center text-lg font-medium">{dateRange}</div>
                                    <CarouselNext className="absolute right-0 translate-x-12 bg-primary text-primary-foreground rounded-full" />
                                </div>
                                <CarouselContent>
                                    {monthChunks.map((chunk, index) => (
                                        <CarouselItem key={index}>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                                                {chunk.map((month) => (
                                                    <Card key={month.toISOString()} className="p-2">
                                                        <Calendar
                                                            month={month}
                                                            showOutsideDays={true}
                                                            className="p-0"
                                                            classNames={calendarClassNames}
                                                            modifiers={modifiers}
                                                            modifiersClassNames={modifiersClassNames}
                                                            components={{
                                                                CaptionLabel: ({ displayMonth }) => {
                                                                    if (!(displayMonth instanceof Date) || isNaN(displayMonth.getTime())) {
                                                                        return null;
                                                                    }
                                                                    return (
                                                                        <div className={calendarClassNames.caption_label}>{format(displayMonth, "MMMM").toUpperCase()}</div>
                                                                    );
                                                                },
                                                            }}
                                                        />
                                                    </Card>
                                                ))}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                             <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: count }).map((_, index) => (
                                    <button key={index} onClick={() => api?.scrollTo(index)} className={`h-2.5 w-2.5 rounded-full transition-colors ${index === current ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'}`} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="w-full h-[600px]" />
                    )}
                </div>
            </div>
        </section>
    )
}

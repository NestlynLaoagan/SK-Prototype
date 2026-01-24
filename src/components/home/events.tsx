"use client"
import React, { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

    useEffect(() => {
        setIsClient(true);
    }, []);

    const calendarClassNames = {
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: "text-sm font-medium uppercase bg-primary text-primary-foreground py-2 px-4 rounded-md",
        nav: "hidden",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center",
        day: "h-8 w-8 p-0 font-normal rounded-full flex items-center justify-center",
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

    return (
        <section id="events" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Events Calendar</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Stay up-to-date with all the happenings in Barangay Bakakeng Central for 2026.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                    {isClient ? months.map((month) => (
                        <Card key={month.toISOString()} className="shadow-md p-3">
                            <Calendar
                                month={month}
                                showOutsideDays={false}
                                className="p-0"
                                classNames={calendarClassNames}
                                modifiers={modifiers}
                                modifiersClassNames={modifiersClassNames}
                            />
                        </Card>
                    )) : (
                        Array.from({ length: 12 }).map((_, index) => (
                            <Card key={index} className="shadow-md p-3 h-[290px]">
                                <Skeleton className="w-full h-full" />
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

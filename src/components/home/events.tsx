"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

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

    const calendarClassNames = {
        month: 'space-y-4',
        caption: 'flex justify-center relative items-center',
        caption_label: "text-base font-medium uppercase w-full bg-primary text-primary-foreground py-2.5 rounded-t-md text-center",
        nav: "hidden",
        table: "w-full border-collapse p-2",
        head_row: "flex justify-around mb-1",
        head_cell: "text-muted-foreground w-8 font-semibold text-sm uppercase text-center",
        row: "flex w-full mt-2 justify-around",
        cell: "h-8 w-8 text-center text-sm p-0 relative flex items-center justify-center",
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        day_selected: "bg-primary/20 text-primary font-bold",
        day_today: "bg-accent text-accent-foreground rounded-full",
        day_outside: "text-muted-foreground opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
    }
    
    const modifiers = {
        event: allEventDays,
    };
    
    const modifiersClassNames = {
        event: 'ring-2 ring-primary rounded-full',
    };

    return (
        <section id="events" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Events</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        This calendar outlines the scheduled events at the Bakakeng Central Basketball Court
                    </p>
                </div>
                
                <div className="grid lg:grid-cols-10 gap-12">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-7">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {months.map((month, monthIndex) => (
                                <Card key={monthIndex} className="shadow-md">
                                    <Calendar
                                        month={month}
                                        showOutsideDays={false}
                                        className="p-0"
                                        classNames={calendarClassNames}
                                        modifiers={modifiers}
                                        modifiersClassNames={modifiersClassNames}
                                    />
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="lg:col-span-3">
                        <div className="space-y-8 sticky top-24">
                           <h3 className="text-3xl font-bold text-primary font-headline text-center">Upcoming Events</h3>
                            {Object.keys(eventsByMonth).length > 0 ? (
                                Object.entries(eventsByMonth).map(([monthName, events]) => (
                                    <div key={monthName}>
                                        <h4 className="text-2xl font-bold text-primary/90 font-headline">{`${monthName} ${year}`}</h4>
                                        <ul className="mt-4 space-y-3 list-none">
                                            {events.map((event, index) => (
                                                <li key={index} className="text-sm border-l-4 border-primary/50 pl-4 py-1.5 bg-secondary/50 rounded-r-lg">
                                                    <span className="font-bold text-foreground">{event.name}</span>
                                                    <br/>
                                                    <span className="text-xs text-muted-foreground">{format(event.date, "MMMM d, yyyy")}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center">No upcoming events scheduled.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

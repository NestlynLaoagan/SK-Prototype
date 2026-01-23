"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

// Mock events data for demonstration
const events = [
  { 
    id: 1, 
    title: "Barangay Assembly Day", 
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
    description: "Discuss important community matters, project updates, and financial reports."
  },
  { 
    id: 2, 
    title: "Community Garden Project Launch", 
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
    description: "Volunteers are needed for the initial setup. Let's grow together!"
  },
  { 
    id: 3, 
    title: "Free Anti-Rabies Vaccination", 
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
    description: "Protect your furry friends! A free anti-rabies vaccination drive at the barangay hall."
  },
  { 
    id: 4, 
    title: "Christmas Caroling Kick-off", 
    date: new Date(new Date().getFullYear(), 11, 16),
    description: "Youth groups will start their house-to-house caroling to raise funds for their projects."
  },
  { 
    id: 5, 
    title: "Simbang Gabi", 
    date: new Date(new Date().getFullYear(), 11, 24),
    description: "Join the community for the traditional Simbang Gabi mass at the barangay chapel."
  },
];

export function Events() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const highlightedDays = events.map(event => event.date);

  const calendarClassNames = {
      month: 'space-y-4',
      caption: 'flex justify-center pt-1 relative items-center',
      caption_label: "text-xl font-medium font-headline",
      nav: "space-x-1 flex items-center",
      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: "h-9 w-9 text-center text-sm p-0 relative",
      day: "h-9 w-9 p-0 font-normal rounded-full flex items-center justify-center aria-selected:opacity-100 transition-colors hover:bg-accent/50",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "text-muted-foreground opacity-50",
      day_disabled: "text-muted-foreground opacity-50",
      day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
      day_highlighted: "bg-primary/20 text-primary-foreground rounded-full",
  }

  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Events Calendar</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Stay up-to-date with all the happenings in our barangay.
          </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-10 gap-12">
            {/* Events List */}
            <div className="lg:col-span-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>A list of scheduled community activities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[450px]">
                            <div className="space-y-4 pr-4">
                                {events.map((event) => (
                                     <div key={event.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">{format(event.date, "PPP")}</p>
                                        <p className="text-sm mt-1">{event.description}</p>
                                     </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar */}
            <div className="lg:col-span-6 flex items-center justify-center">
                 <Card className="p-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        modifiers={{ highlighted: highlightedDays }}
                        modifiersClassNames={{
                            highlighted: calendarClassNames.day_highlighted,
                        }}
                        className="rounded-md"
                        classNames={calendarClassNames}
                    />
                 </Card>
            </div>
        </div>
      </div>
    </section>
  )
}

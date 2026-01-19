"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type Event = {
    id: number;
    name: string;
    start: string;
    end: string;
    status: string;
};

const initialEvents: Event[] = [
    { id: 1, name: "Barangay Assembly Day", start: "2024-10-28 09:00", end: "2024-10-28 12:00", status: "Upcoming" },
    { id: 2, name: "Community Garden Project Launch", start: "2024-11-05 08:00", end: "2024-11-05 11:00", status: "Upcoming" },
    { id: 3, name: "Free Anti-Rabies Vaccination", start: "2024-11-15 09:00", end: "2024-11-15 16:00", status: "Upcoming" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const { toast } = useToast();

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      name: "New Event",
      start: new Date().toISOString().slice(0, 16).replace('T', ' '),
      end: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: "Planning",
    };
    setEvents([...events, newEvent]);
    toast({
      title: "New event added",
      description: "A new event has been added. You can edit it in the table.",
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Event deleted",
      description: "The event has been successfully deleted.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Event Management</h1>
        <p className="text-muted-foreground">Create, edit, and manage all community events.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Schedule and manage upcoming barangay events.</CardDescription>
            </div>
            <Button onClick={handleAddEvent}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Event
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Start Date & Time</TableHead>
                        <TableHead>End Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map(event => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.name}</TableCell>
                            <TableCell>{event.start}</TableCell>
                            <TableCell>{event.end}</TableCell>
                            <TableCell>{event.status}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

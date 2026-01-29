"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "@/components/admin/event-form";
import { format } from 'date-fns';

export type Event = {
    id: number;
    name: string;
    start: string;
    end: string;
    status: string;
};

const initialEvents: Event[] = [
    { id: 1, name: "Barangay Assembly Day", start: "2024-10-28T09:00", end: "2024-10-28T12:00", status: "Upcoming" },
    { id: 2, name: "Community Garden Project Launch", start: "2024-11-05T08:00", end: "2024-11-05T11:00", status: "Upcoming" },
    { id: 3, name: "Free Anti-Rabies Vaccination", start: "2024-11-15T09:00", end: "2024-11-15T16:00", status: "Upcoming" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const handleAddEvent = () => {
    setEventToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = (savedEventData: Omit<Event, 'id'> & { id?: number }) => {
    if (savedEventData.id) {
        // Editing existing event
        setEvents(events.map(e => e.id === savedEventData.id ? { ...e, ...savedEventData, id: e.id } : e));
    } else {
        // Adding new event
        const newEvent: Event = {
            ...(savedEventData as Omit<Event, 'id'>),
            id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        };
        setEvents([...events, newEvent]);
    }
  };

  const handleDeleteConfirm = () => {
    if (!eventToDelete) return;
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    toast({
      title: "Event deleted",
      description: `The event "${eventToDelete.name}" has been successfully deleted.`,
      variant: "destructive",
    });
    setEventToDelete(null);
  };
  
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'N/A';
    try {
        return format(new Date(dateTimeString), "MMM d, yyyy h:mm a");
    } catch (e) {
        return 'Invalid Date';
    }
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
                            <TableCell className="text-xs">{formatDateTime(event.start)}</TableCell>
                            <TableCell className="text-xs">{formatDateTime(event.end)}</TableCell>
                            <TableCell>{event.status}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditClick(event)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setEventToDelete(event)} className="text-destructive">
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

      {/* Dialog for Add/Edit Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>{eventToEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
              </DialogHeader>
              <EventForm
                  key={eventToEdit?.id || 'new'}
                  event={eventToEdit} 
                  onSave={handleSaveEvent}
                  onClose={() => setIsFormOpen(false)} 
              />
          </DialogContent>
      </Dialog>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event titled &quot;{eventToDelete?.name}&quot;.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit, Loader } from "lucide-react";
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
import { format, parseISO } from 'date-fns';
import { useFirebase, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import type { Event } from "@/lib/types";


export default function EventsPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const eventsCollectionRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'events'), orderBy('start', 'desc')) : null,
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Event>(eventsCollectionRef);

  const handleAddEvent = () => {
    setEventToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = (savedEventData: Omit<Event, 'id'>) => {
    if (!firestore) return;

    const docRef = eventToEdit 
        ? doc(firestore, 'events', eventToEdit.id)
        : doc(collection(firestore, 'events'));

    const dataToSave = {
        ...savedEventData,
        id: docRef.id,
    };
    
    setDocumentNonBlocking(docRef, dataToSave, { merge: true });
  };

  const handleDeleteConfirm = () => {
    if (!eventToDelete || !firestore) return;
    const docRef = doc(firestore, 'events', eventToDelete.id);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "Event deleted",
      description: `The event "${eventToDelete.title}" has been successfully deleted.`,
      variant: "destructive",
    });
    setEventToDelete(null);
  };
  
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'N/A';
    try {
        return format(parseISO(dateTimeString), "MMM d, yyyy h:mm a");
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
                <CardTitle>Community Events</CardTitle>
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
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                <div className="flex justify-center p-8">
                                    <Loader className="h-6 w-6 animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {events?.map(event => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
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
                      This action cannot be undone. This will permanently delete the event titled &quot;{eventToDelete?.title}&quot;.
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

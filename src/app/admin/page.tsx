
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardCheck, Calendar, Users, Megaphone, PlusCircle, MoreHorizontal, Edit, Trash2, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { useFirebase, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { format, parseISO } from 'date-fns';
import type { Announcement, Event as EventType, User as UserType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | undefined>(undefined);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

    const announcementsCollectionRef = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'announcements'), orderBy('date', 'desc')) : null,
        [firestore]
    );
    const eventsCollectionRef = useMemoFirebase(
        () => firestore ? collection(firestore, 'events') : null,
        [firestore]
    );
    const usersCollectionRef = useMemoFirebase(
        () => firestore ? collection(firestore, 'users') : null,
        [firestore]
    );

    const { data: announcements, isLoading: isLoadingAnnouncements } = useCollection<Announcement>(announcementsCollectionRef);
    const { data: events, isLoading: isLoadingEvents } = useCollection<EventType>(eventsCollectionRef);
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserType>(usersCollectionRef);

    const upcomingEventsCount = useMemo(() => {
        if (!events) return 0;
        return events.filter(event => event.status === 'Upcoming' || event.status === 'Ongoing').length;
    }, [events]);

    const stats = [
        { title: "Upcoming Events", value: isLoadingEvents ? <Loader className="h-5 w-5 animate-spin" /> : upcomingEventsCount, icon: Calendar },
        { title: "Finished Projects", value: "45", icon: ClipboardCheck },
        { title: "Community Members", value: isLoadingUsers ? <Loader className="h-5 w-5 animate-spin" /> : users?.length ?? 0, icon: Users },
        { title: "Announcements", value: isLoadingAnnouncements ? <Loader className="h-5 w-5 animate-spin" /> : announcements?.length ?? 0, icon: Megaphone },
    ];
    
    const handleAddClick = () => {
        setAnnouncementToEdit(undefined);
        setIsFormOpen(true);
    };

    const handleEditClick = (announcement: Announcement) => {
        setAnnouncementToEdit(announcement);
        setIsFormOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!announcementToDelete || !firestore) return;
        const docRef = doc(firestore, 'announcements', announcementToDelete.id);
        deleteDocumentNonBlocking(docRef);
        toast({
            title: "Announcement Deleted",
            description: "The announcement has been successfully deleted.",
            variant: "destructive",
        });
        setAnnouncementToDelete(null);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-accent">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-accent-foreground">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 text-primary`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Announcements</CardTitle>
                        <CardDescription>Manage all barangay announcements.</CardDescription>
                    </div>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Announcement
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingAnnouncements && <div className="flex justify-center py-8"><Loader className="h-8 w-8 animate-spin" /></div>}
                    {!isLoadingAnnouncements && announcements && announcements.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No announcements have been posted yet.</p>
                    )}
                    {!isLoadingAnnouncements && announcements?.map((ann) => {
                        const AnnIcon = ann.type === 'assembly' ? Users : Megaphone;
                        return (
                            <Card key={ann.id} className="bg-background border">
                                <div className="p-4 flex justify-between items-start">
                                    <div className="flex-1 flex items-start gap-4">
                                        <AnnIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-foreground">{ann.title}</p>
                                                <Badge className={cn(
                                                    "capitalize text-xs",
                                                    ann.status === 'Completed' && 'bg-green-100 text-green-800 border-green-200',
                                                    ann.status === 'Upcoming' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                    ann.status === 'Canceled' && 'bg-red-100 text-red-800 border-red-200'
                                                )}>
                                                    {ann.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {format(parseISO(ann.date), 'PPP p')}
                                            </p>
                                            <p className="text-sm text-muted-foreground pt-2">{ann.content}</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(ann)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setAnnouncementToDelete(ann)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Dialog for Add/Edit Form */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{announcementToEdit ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
                    </DialogHeader>
                    <AnnouncementForm
                        key={announcementToEdit?.id || 'new'}
                        announcement={announcementToEdit} 
                        onClose={() => setIsFormOpen(false)} 
                    />
                </DialogContent>
            </Dialog>

            {/* Alert Dialog for Delete Confirmation */}
            <AlertDialog open={!!announcementToDelete} onOpenChange={(open) => !open && setAnnouncementToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the announcement titled &quot;{announcementToDelete?.title}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAnnouncementToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

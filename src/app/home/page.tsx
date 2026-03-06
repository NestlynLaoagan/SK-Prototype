
"use client";

import { AppHeader } from "@/components/app-header";
import { Hero } from "@/components/home/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Users, Loader, Calendar, MapPin } from "lucide-react";
import { CurrentYear } from "@/components/current-year";
import { MemberAuthGuard } from "@/components/auth/member-auth-guard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { format, parseISO } from "date-fns";
import type { Announcement } from "@/lib/types";
import dynamic from "next/dynamic";

const Projects = dynamic(() => import('@/components/home/projects').then(mod => mod.Projects), {
  loading: () => <div className="flex justify-center items-center h-96"><Loader className="w-12 h-12 animate-spin" /></div>,
  ssr: false,
});

const Events = dynamic(() => import('@/components/home/events').then(mod => mod.Events), {
  loading: () => <div className="flex justify-center items-center h-96"><Loader className="w-12 h-12 animate-spin" /></div>,
  ssr: false,
});

const Feedback = dynamic(() => import('@/components/home/feedback').then(mod => mod.Feedback), {
  loading: () => <div className="flex justify-center items-center h-96"><Loader className="w-12 h-12 animate-spin" /></div>,
  ssr: false,
});

const IskaiChatbot = dynamic(() => import('@/components/iskai-chatbot').then(mod => mod.IskaiChatbot), {
  ssr: false,
});


export default function HomePage() {
  const { firestore } = useFirebase();
  const announcementsCollectionRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'announcements'), orderBy('date', 'desc'), limit(5)) : null,
    [firestore]
  );
  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsCollectionRef);


  return (
    <MemberAuthGuard>
        <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1">
            <Hero />
            <section id="announcements" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
            <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-3">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Announcements</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Stay informed about important news and updates in our community.
                </p>
                </div>

                <div className="w-full max-w-4xl grid gap-6">
                    {isLoading && <div className="flex justify-center p-8"><Loader className="h-8 w-8 animate-spin" /></div>}
                    {!isLoading && announcements?.map((announcement) => {
                       const AnnIcon = announcement.type === 'assembly' ? Users : Megaphone;
                       return (
                        <Card key={announcement.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col">
                                    <div className="flex items-start gap-4">
                                        <AnnIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                                                <Badge className={cn(
                                                    "capitalize",
                                                    announcement.status === 'Completed' && 'bg-green-100 text-green-800 border-green-200',
                                                    announcement.status === 'Upcoming' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                    announcement.status === 'Canceled' && 'bg-red-100 text-red-800 border-red-200',
                                                    announcement.status === 'Ongoing' && 'bg-blue-100 text-blue-800 border-blue-200'
                                                )}>
                                                    {announcement.status}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1 mt-2">
                                                {announcement.eventDate && (
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{format(parseISO(announcement.eventDate), "PPP 'at' p")}</span>
                                                    </div>
                                                )}
                                                {announcement.location && (
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{announcement.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground pt-2">{announcement.content}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-right mt-2">Posted on {format(parseISO(announcement.date), "MMM d, yyyy, p")}</p>
                                </div>
                            </CardContent>
                        </Card>
                       )
                    })}
                     {!isLoading && announcements?.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No announcements to display.</p>
                     )}
                </div>
            </div>
            </section>
            <Projects />
            <Events />
            <Feedback />
        </main>
        <IskaiChatbot />
        <footer className="bg-secondary/50">
            <div className="container py-6 text-center text-muted-foreground text-sm">
            © <CurrentYear /> Barangay Bakakeng Central. All Rights Reserved.
            </div>
        </footer>
        </div>
    </MemberAuthGuard>
  );
}

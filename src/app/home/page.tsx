
"use client";

import { AppHeader } from "@/components/app-header";
import { Events } from "@/components/home/events";
import { Feedback } from "@/components/home/feedback";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { IskaiChatbot } from "@/components/iskai-chatbot";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, Users, Loader } from "lucide-react";
import { CurrentYear } from "@/components/current-year";
import { MemberAuthGuard } from "@/components/auth/member-auth-guard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { format, parseISO } from "date-fns";
import type { Announcement } from "@/lib/types";


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
                    {!isLoading && announcements?.map((announcement) => (
                        <Card key={announcement.id}>
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                <div className="mt-1">
                                    <Megaphone className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                      <CardTitle>{announcement.title}</CardTitle>
                                      <Badge className={cn(
                                          "capitalize",
                                          announcement.status === 'Completed' && 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100/80',
                                          announcement.status === 'Upcoming' && 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100/80',
                                          announcement.status === 'Canceled' && 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100/80'
                                      )}>
                                          {announcement.status}
                                      </Badge>
                                  </div>
                                  <CardDescription>{format(parseISO(announcement.date), "PPP")}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{announcement.content}</p>
                            </CardContent>
                        </Card>
                    ))}
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

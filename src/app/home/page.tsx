import { AppHeader } from "@/components/app-header";
import { Events } from "@/components/home/events";
import { Feedback } from "@/components/home/feedback";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { IskaiChatbot } from "@/components/iskai-chatbot";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, Users } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Barangay Assembly Day",
    date: "October 28, 2024",
    content: "Join us for the semi-annual Barangay Assembly Day to discuss important community matters, project updates, and financial reports. Your participation is crucial for our barangay's progress.",
    icon: Users,
  },
  {
    id: 2,
    title: "Community Garden Project Launch",
    date: "November 5, 2024",
    content: "We are excited to launch the new Community Garden project. Volunteers are needed for the initial setup. Let's grow together!",
    icon: Megaphone,
  },
  {
    id: 3,
    title: "Free Anti-Rabies Vaccination for Pets",
    date: "November 15, 2024",
    content: "Protect your furry friends! We will be conducting a free anti-rabies vaccination drive at the barangay hall. Open to all residents.",
    icon: Megaphone,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Events />
        <section id="announcements" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Announcements</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stay informed about important news and updates in our community.
              </p>
            </div>

            <div className="w-full max-w-4xl grid gap-6">
                {announcements.map((announcement) => (
                    <Card key={announcement.id}>
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="mt-1">
                                <announcement.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>{announcement.title}</CardTitle>
                                <CardDescription>{announcement.date}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{announcement.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
        </section>
        <Feedback />
      </main>
      <IskaiChatbot />
       <footer className="bg-secondary/50">
        <div className="container py-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Barangay Bakakeng Central. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

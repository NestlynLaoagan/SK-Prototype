import { AppHeader } from "@/components/app-header";
import { Events } from "@/components/home/events";
import { Feedback } from "@/components/home/feedback";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { IskaiChatbot } from "@/components/iskai-chatbot";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Events />
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

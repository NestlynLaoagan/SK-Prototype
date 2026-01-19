import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section id="home" className="w-full py-24 md:py-32 lg:py-40 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Welcome to Barangay Bakakeng Central
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Stay connected, informed, and engaged with your community. Explore projects, events, and services all in one place.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <a href="#events">View Events</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#projects">Explore Projects</a>
              </Button>
            </div>
          </div>
          <img
            src="https://picsum.photos/seed/hero/600/400"
            width="600"
            height="400"
            alt="Hero"
            data-ai-hint="philippine community"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}

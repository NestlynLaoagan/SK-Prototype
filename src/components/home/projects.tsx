"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import type { Project } from "@/lib/types"
import { Loader } from "lucide-react"

export function Projects() {
  const [mainApi, setMainApi] = React.useState<CarouselApi>()
  const [thumbApi, setThumbApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  const { firestore } = useFirebase();
  const accomplishedProjectsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'projects'), where("status", "==", "Completed")) : null,
  [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(accomplishedProjectsQuery);

  const carouselItems = React.useMemo(() => {
    if (!projects) return [];
    return projects.map(project => ({
      id: project.id,
      description: project.name,
      imageUrl: project.imageUrls?.[0] || `https://picsum.photos/seed/${project.id}/600/400`,
      imageHint: "community project"
    }));
  }, [projects]);


  React.useEffect(() => {
    if (!mainApi || !thumbApi) {
      return
    }

    const onSelect = () => {
      if (!mainApi || !thumbApi) return;
      setSelectedIndex(mainApi.selectedScrollSnap())
      thumbApi.scrollTo(mainApi.selectedScrollSnap())
    }

    mainApi.on("select", onSelect)
    mainApi.on('reInit', onSelect)

    onSelect() // Set initial state
    
    return () => {
        mainApi.off("select", onSelect)
        mainApi.off('reInit', onSelect)
    }
  }, [mainApi, thumbApi])


  return (
    <section id="projects" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container flex flex-col items-center gap-8 px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-3">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Accomplished Projects</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Take a look at the successful initiatives that have helped our community grow and prosper.
                </p>
            </div>

            <div className="w-full max-w-5xl">
                {isLoading && (
                    <div className="flex justify-center items-center h-96">
                        <Loader className="w-12 h-12 animate-spin" />
                    </div>
                )}
                {!isLoading && carouselItems.length === 0 && (
                    <div className="flex justify-center items-center h-48 border rounded-lg bg-muted">
                        <p className="text-muted-foreground">No accomplished projects to display yet.</p>
                    </div>
                )}
                {!isLoading && carouselItems.length > 0 && (
                  <>
                    <Carousel
                        setApi={setMainApi}
                        plugins={[plugin.current]}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={() => {
                            plugin.current.play()
                        }}
                    >
                        <CarouselContent>
                        {carouselItems.map((item, index) => (
                            <CarouselItem key={item.id}>
                                <Card>
                                    <CardContent className="relative aspect-video flex items-center justify-center p-0">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.description}
                                        fill
                                        className="object-cover rounded-lg"
                                        data-ai-hint={item.imageHint}
                                    />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                    </Carousel>

                    <Carousel setApi={setThumbApi} className="w-full mt-4">
                        <CarouselContent className="h-24">
                        {carouselItems.map((item, index) => (
                            <CarouselItem key={item.id} className="pt-1 basis-1/2 md:basis-1/3 lg:basis-1/5 h-full">
                                <div className="p-1 h-full">
                                    <Card 
                                        className={`h-full flex flex-col transition-all cursor-pointer ${index === selectedIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
                                        onClick={() => {
                                            if (!mainApi) return;
                                            mainApi.scrollTo(index);
                                            plugin.current.reset(); // Reset autoplay timer on manual navigation
                                        }}
                                    >
                                        <CardContent className="flex-grow flex items-center justify-center p-2 text-center text-sm text-muted-foreground">
                                            {item.description}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                    </Carousel>
                  </>
                )}
            </div>
        </div>
    </section>
  )
}

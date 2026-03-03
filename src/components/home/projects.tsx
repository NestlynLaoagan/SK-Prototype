"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Image from "next/image"
import { Card, CardContent } from "../ui/card"

export function Projects() {
  const [mainApi, setMainApi] = React.useState<CarouselApi>()
  const [thumbApi, setThumbApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    if (!mainApi || !thumbApi) {
      return
    }

    const onSelect = () => {
      setSelectedIndex(mainApi.selectedScrollSnap())
      thumbApi.scrollTo(mainApi.selectedScrollSnap())
    }

    mainApi.on("select", onSelect)
    onSelect()
    
    return () => {
        mainApi.off("select", onSelect)
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
                 <Carousel
                    setApi={setMainApi}
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                    {PlaceHolderImages.map((img, index) => (
                        <CarouselItem key={index}>
                            <Card>
                                <CardContent className="relative aspect-video flex items-center justify-center p-0">
                                <Image
                                    src={img.imageUrl}
                                    alt={img.description}
                                    fill
                                    className="object-cover rounded-lg"
                                    data-ai-hint={img.imageHint}
                                />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>

                <Carousel setApi={setThumbApi} className="w-full mt-4">
                    <CarouselContent className="h-20">
                    {PlaceHolderImages.map((img, index) => (
                        <CarouselItem key={index} className="pt-1 basis-1/2 md:basis-1/3 lg:basis-1/5 h-full">
                            <div className="p-1 h-full">
                                <Card 
                                    className={`h-full flex items-center justify-center transition-all ${index === selectedIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
                                    onClick={() => mainApi?.scrollTo(index)}
                                >
                                    <CardContent className="p-2 text-center text-xs text-muted-foreground">
                                        {img.description}
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    </section>
  )
}

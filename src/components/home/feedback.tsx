"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFirebase, useUser, setDocumentNonBlocking } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { Loader } from "lucide-react"

const formSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required." }),
  rating: z.enum(["good", "average", "bad"], { required_error: "Please select a rating." }),
  comment: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export function Feedback() {
  const router = useRouter()
  const { toast } = useToast()
  const { firestore } = useFirebase()
  const { user } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      comment: "",
    },
  })

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to submit feedback.",
        });
        return;
    }

    const feedbackRef = doc(collection(firestore, `users/${user.uid}/feedback`));

    const feedbackData = {
        ...values,
        id: feedbackRef.id,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        submissionDate: new Date().toISOString(),
    };

    setDocumentNonBlocking(feedbackRef, feedbackData, {});

    toast({
      title: "Feedback Sent!",
      description: "Thank you for your valuable input.",
    });

    form.reset();
    router.push("/home#home");
  }

  return (
    <section id="feedback" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container flex flex-col items-center gap-8 px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-3">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Share Your Feedback</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We value your opinion. Let us know how we can improve our services and community projects.
                </p>
            </div>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Feedback Form</CardTitle>
                    <CardDescription>Your feedback is anonymous but associated with your account for administrative purposes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="Regarding..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="average">Average</SelectItem>
                                        <SelectItem value="bad">Bad</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us what you think..." className="min-h-[120px]" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Send Feedback"}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </section>
  )
}

"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { analyzeFeedback, type AnalyzeFeedbackInput, type AnalyzeFeedbackOutput } from "@/ai/flows/admin-feedback-analysis"
import { Badge } from "../ui/badge"

const formSchema = z.object({
  feedbackText: z.string().min(10, {
    message: "Feedback must be at least 10 characters.",
  }),
})

type SentimentData = {
  name: string
  good: number
  average: number
  bad: number
}

export function FeedbackAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFeedbackOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedbackText: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAnalysisResult(null)
    try {
      const result = await analyzeFeedback(values)
      setAnalysisResult(result)
    } catch (error) {
      console.error("Failed to analyze feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = analysisResult ? [
    { name: "Sentiment", good: analysisResult.sentimentAnalysis.overallSentiment === 'good' ? 1 : 0, average: analysisResult.sentimentAnalysis.overallSentiment === 'average' ? 1 : 0, bad: analysisResult.sentimentAnalysis.overallSentiment === 'bad' ? 1 : 0 },
  ] : []

  const chartConfig = {
    good: { label: "Good", color: "hsl(var(--chart-2))" },
    average: { label: "Average", color: "hsl(var(--chart-4))" },
    bad: { label: "Bad", color: "hsl(var(--destructive))" },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Feedback Analysis</CardTitle>
        <CardDescription>
          Enter user feedback below to get an automated sentiment analysis and suggestions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="feedbackText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'The recent basketball league was amazing! I hope there are more sports events for the youth.'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Feedback
            </Button>
          </CardFooter>
        </form>
      </Form>
      {analysisResult && (
        <>
        <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h4 className="font-medium">Overall Sentiment</h4>
                <Badge variant={
                    analysisResult.sentimentAnalysis.overallSentiment === 'good' ? 'default' : 
                    analysisResult.sentimentAnalysis.overallSentiment === 'bad' ? 'destructive' : 'secondary'
                } className="capitalize text-sm">
                    {analysisResult.sentimentAnalysis.overallSentiment}
                </Badge>
            </div>
             <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" barSize={30}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="good" fill="var(--color-good)" radius={5} />
                        <Bar dataKey="average" fill="var(--color-average)" radius={5} />
                        <Bar dataKey="bad" fill="var(--color-bad)" radius={5} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium">Positive Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                    {analysisResult.sentimentAnalysis.positiveKeywords.map((kw, i) => <Badge key={i} variant="secondary">{kw}</Badge>)}
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="font-medium">Negative Keywords</h4>
                     <div className="flex flex-wrap gap-2">
                    {analysisResult.sentimentAnalysis.negativeKeywords.map((kw, i) => <Badge key={i} variant="outline">{kw}</Badge>)}
                    </div>
                </div>
            </div>
             <div className="space-y-2">
                <h4 className="font-medium">Suggestions for Improvement</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {analysisResult.sentimentAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
        </CardContent>
        </>
      )}
    </Card>
  )
}


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const feedbackStats = {
    good: 2,
    average: 1,
    bad: 0,
};

const totalFeedback = feedbackStats.good + feedbackStats.average + feedbackStats.bad;

const allFeedback = [
    {
        id: 1,
        name: "Juan Dela Cruz",
        rating: "GOOD",
        date: "2026-01-14",
        subject: "Website Improvement",
        comment: "The new website looks great! Very easy to navigate."
    },
    {
        id: 2,
        name: "Maria Santos",
        rating: "AVERAGE",
        date: "2026-01-13",
        subject: "Event Notification",
        comment: "The notification for the event was a bit late. Maybe send it out earlier next time?"
    },
];

export default function FeedbackPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
                </div>
                 <div className="flex items-center gap-2">
                    <Select defaultValue="yearly">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">Feedback Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <Card className="bg-green-50 p-4 border-green-200">
                            <p className="text-4xl font-bold text-green-700">{feedbackStats.good}</p>
                            <p className="text-xs text-green-600 mt-1">Good Ratings</p>
                        </Card>
                        <Card className="bg-amber-50 p-4 border-amber-200">
                            <p className="text-4xl font-bold text-amber-700">{feedbackStats.average}</p>
                            <p className="text-xs text-amber-600 mt-1">Average Ratings</p>
                        </Card>
                        <Card className="bg-red-50 p-4 border-red-200">
                            <p className="text-4xl font-bold text-red-700">{feedbackStats.bad}</p>
                            <p className="text-xs text-red-600 mt-1">Bad Ratings</p>
                        </Card>
                    </div>
                    <div className="text-center pt-2">
                        <p className="text-2xl font-bold">{totalFeedback}</p>
                        <p className="text-xs text-muted-foreground">Total Feedback (yearly)</p>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-lg font-semibold mb-2">All Feedback</h2>
                <div className="space-y-4">
                    {allFeedback.map((item) => (
                         <Card key={item.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <Badge 
                                        className={cn("font-semibold",
                                            item.rating === 'GOOD' && "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200",
                                            item.rating === 'AVERAGE' && "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200",
                                            item.rating === 'BAD' && "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200"
                                        )}
                                    >
                                        {item.rating}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive h-7 w-7">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm font-medium">Subject: {item.subject}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{item.comment}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    )
}

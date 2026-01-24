
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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

const pieData = [
    { name: 'Good', value: feedbackStats.good },
    { name: 'Average', value: feedbackStats.average },
    // { name: 'Bad', value: feedbackStats.bad },
].filter(d => d.value > 0);

const COLORS = ['#16a34a', '#f59e0b'];

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

const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col space-y-2">
        {payload.map((entry: any, index: any) => (
          <li key={`item-${index}`} className="flex items-center text-sm">
            <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            <span className="text-muted-foreground">{entry.value}: {entry.payload.value}</span>
          </li>
        ))}
      </ul>
    );
};

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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
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
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="w-full h-48 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            paddingAngle={pieData.length > 1 ? 5 : 0}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background stroke-2" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{fontSize: '12px', padding: '4px 8px'}}/>
                                        <Legend content={<CustomLegend />} verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{paddingLeft: '20px'}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

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

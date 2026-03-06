
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Loader, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collectionGroup, query, orderBy, doc } from "firebase/firestore";
import type { Feedback as FeedbackModel } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const COLORS = {
    good: 'hsl(var(--primary))',
    average: 'hsl(var(--chart-4))',
    bad: 'hsl(var(--destructive))',
};

export default function FeedbackPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackModel | null>(null);

    const feedbackQuery = useMemoFirebase(
        () => firestore ? query(collectionGroup(firestore, 'feedback'), orderBy('submissionDate', 'desc')) : null,
        [firestore]
    );

    const { data: allFeedback, isLoading: isLoadingFeedback } = useCollection<FeedbackModel>(feedbackQuery);

    const feedbackStats = useMemo(() => {
        if (!allFeedback) {
            return { good: 0, average: 0, bad: 0 };
        }
        return allFeedback.reduce((acc, feedback) => {
            acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
            return acc;
        }, { good: 0, average: 0, bad: 0 });
    }, [allFeedback]);

    const totalFeedback = allFeedback?.length || 0;
    
    const chartData = [
        { name: 'Good', value: feedbackStats.good },
        { name: 'Average', value: feedbackStats.average },
        { name: 'Bad', value: feedbackStats.bad },
    ].filter(item => item.value > 0);

    const handleDeleteConfirm = () => {
        if (!feedbackToDelete || !firestore) return;
        const docRef = doc(firestore, `users/${feedbackToDelete.userId}/feedback`, feedbackToDelete.id);
        deleteDocumentNonBlocking(docRef);
        toast({
            title: "Feedback deleted",
            description: "The feedback has been successfully deleted.",
            variant: "destructive",
        });
        setFeedbackToDelete(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
                    <p className="text-muted-foreground">Review and analyze user feedback.</p>
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
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Feedback Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <Card className="bg-green-50 p-4 border-green-200">
                                <p className="text-4xl font-bold text-green-700">{isLoadingFeedback ? <Loader className="h-10 w-10 mx-auto animate-spin" /> : feedbackStats.good}</p>
                                <p className="text-xs text-green-600 mt-1">Good Ratings</p>
                            </Card>
                            <Card className="bg-amber-50 p-4 border-amber-200">
                                <p className="text-4xl font-bold text-amber-700">{isLoadingFeedback ? <Loader className="h-10 w-10 mx-auto animate-spin" /> : feedbackStats.average}</p>
                                <p className="text-xs text-amber-600 mt-1">Average Ratings</p>
                            </Card>
                            <Card className="bg-red-50 p-4 border-red-200">
                                <p className="text-4xl font-bold text-red-700">{isLoadingFeedback ? <Loader className="h-10 w-10 mx-auto animate-spin" /> : feedbackStats.bad}</p>
                                <p className="text-xs text-red-600 mt-1">Bad Ratings</p>
                            </Card>
                        </div>
                        <div className="text-center pt-2">
                            <p className="text-2xl font-bold">{isLoadingFeedback ? <Loader className="h-6 w-6 mx-auto animate-spin" /> : totalFeedback}</p>
                            <p className="text-xs text-muted-foreground">Total Feedback (yearly)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Rating Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingFeedback ? (
                            <div className="flex justify-center items-center h-[200px]"><Loader className="h-8 w-8 animate-spin" /></div>
                        ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">All Feedback</h2>
                <div className="space-y-4">
                    {isLoadingFeedback && <div className="flex justify-center py-8"><Loader className="h-8 w-8 animate-spin" /></div>}
                    {allFeedback?.map((item) => (
                         <Card key={item.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold text-sm">{item.userName}</p>
                                    <Badge 
                                        className={cn("font-semibold capitalize",
                                            item.rating === 'good' && "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200",
                                            item.rating === 'average' && "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200",
                                            item.rating === 'bad' && "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200"
                                        )}
                                    >
                                        {item.rating}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">{format(parseISO(item.submissionDate), 'PPP')}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => setFeedbackToDelete(item)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm font-medium">Subject: {item.subject}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{item.comment}</p>
                            </div>
                        </Card>
                    ))}
                    {!isLoadingFeedback && allFeedback?.length === 0 && (
                        <Card className="p-8 text-center text-muted-foreground">No feedback submitted yet.</Card>
                    )}
                </div>
            </div>

            <AlertDialog open={!!feedbackToDelete} onOpenChange={(open) => !open && setFeedbackToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this feedback from {feedbackToDelete?.userName}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

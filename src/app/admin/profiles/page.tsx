
"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Filter, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { User as UserModel } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const DemographicChart = ({ title, data }: { title: string; data: { name: string; count: number }[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 50, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false} 
                angle={-35}
                textAnchor="end"
                height={60}
                interval={0}
                fontSize={12}
                />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
            </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);


export default function ProfilesPage() {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const usersCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: profiles, isLoading } = useCollection<UserModel>(usersCollectionRef);

  const handleExport = () => {
    toast({
        title: "Exporting data...",
        description: "Your data is being prepared for download.",
    });
    // In a real app, this would trigger a download.
  }
  
  const demographics = useMemo(() => {
    if (!profiles) {
      return {
        civilStatus: [],
        workStatus: [],
        youthAgeGroup: [],
        youthClassification: [],
      };
    }

    const civilStatusCounts: Record<string, number> = {};
    const workStatusCounts: Record<string, number> = {};
    const youthAgeGroupCounts: Record<string, number> = {};
    const youthClassificationCounts: Record<string, number> = {};

    profiles.forEach(p => {
      if (p.civilStatus) {
        civilStatusCounts[p.civilStatus] = (civilStatusCounts[p.civilStatus] || 0) + 1;
      }
      if (p.workStatus) {
        workStatusCounts[p.workStatus] = (workStatusCounts[p.workStatus] || 0) + 1;
      }
      if (p.youthAgeGroup) {
        youthAgeGroupCounts[p.youthAgeGroup] = (youthAgeGroupCounts[p.youthAgeGroup] || 0) + 1;
      }
      if (p.youthClassification) {
        youthClassificationCounts[p.youthClassification] = (youthClassificationCounts[p.youthClassification] || 0) + 1;
      }
    });

    const formatForChart = (counts: Record<string, number>) => Object.entries(counts).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '), count }));

    return {
      civilStatus: formatForChart(civilStatusCounts),
      workStatus: formatForChart(workStatusCounts),
      youthAgeGroup: Object.entries(youthAgeGroupCounts).map(([name, count]) => ({ name: `${name} yrs old`, count })),
      youthClassification: formatForChart(youthClassificationCounts),
    };
  }, [profiles]);


  return (
    <div className="space-y-8">
       <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-headline font-bold">Profiling Summary</h1>
                <p className="text-muted-foreground">View and export community member profiles.</p>
            </div>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="monthly">This Month</SelectItem>
                            <SelectItem value="yearly">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export as Spreadsheet
                 </Button>
            </div>
        </div>

        <Tabs defaultValue="data-summary">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="data-summary">Data Summary</TabsTrigger>
                <TabsTrigger value="demographics">Demographics Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="data-summary">
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Civil Status</TableHead>
                                    <TableHead>Work Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            <Loader className="mx-auto h-6 w-6 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {profiles?.map(profile => (
                                    <TableRow key={profile.id}>
                                        <TableCell className="font-medium">{profile.fullName}</TableCell>
                                        <TableCell>{profile.age || 'N/A'}</TableCell>
                                        <TableCell>{profile.gender || 'N/A'}</TableCell>
                                        <TableCell>{profile.civilStatus ? profile.civilStatus.charAt(0).toUpperCase() + profile.civilStatus.slice(1) : 'N/A'}</TableCell>
                                        <TableCell>{profile.workStatus ? profile.workStatus.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="demographics">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader className="mx-auto h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DemographicChart title="Civil Status" data={demographics.civilStatus} />
                        <DemographicChart title="Work Status" data={demographics.workStatus} />
                        <DemographicChart title="Youth Age Group" data={demographics.youthAgeGroup} />
                        <DemographicChart title="Youth Classification" data={demographics.youthClassification} />
                    </div>
                )}
            </TabsContent>
        </Tabs>
    </div>
  );
}

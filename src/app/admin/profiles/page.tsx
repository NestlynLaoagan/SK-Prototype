"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { User as UserModel } from "@/lib/types";

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

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-headline font-bold">Profile Summary</h1>
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
                            <TableCell>{profile.civilStatus || 'N/A'}</TableCell>
                            <TableCell>{profile.workStatus || 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

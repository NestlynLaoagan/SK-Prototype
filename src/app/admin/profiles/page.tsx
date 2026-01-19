import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter } from "lucide-react";

const profiles = [
    { id: 1, name: "Juan Dela Cruz", age: 25, gender: "Male", civilStatus: "Single", workStatus: "Employed" },
    { id: 2, name: "Maria Clara", age: 22, gender: "Female", civilStatus: "Single", workStatus: "Student" },
    { id: 3, name: "Crisostomo Ibarra", age: 28, gender: "Male", civilStatus: "Married", workStatus: "Self-Employed" },
    { id: 4, name: "Sisa", age: 30, gender: "Female", civilStatus: "Widowed", workStatus: "Unemployed" },
];

export default function ProfilesPage() {
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
                 <Button>
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
                    {profiles.map(profile => (
                        <TableRow key={profile.id}>
                            <TableCell className="font-medium">{profile.name}</TableCell>
                            <TableCell>{profile.age}</TableCell>
                            <TableCell>{profile.gender}</TableCell>
                            <TableCell>{profile.civilStatus}</TableCell>
                            <TableCell>{profile.workStatus}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

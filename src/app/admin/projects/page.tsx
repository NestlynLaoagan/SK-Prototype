import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";

const upcomingProjects = [
    { id: 1, name: "Community Garden Phase 2", status: "In Progress", budget: "₱50,000" },
    { id: 2, name: "Youth Sports Fest 2025", status: "Planning", budget: "₱120,000" },
    { id: 3, name: "Barangay Hall Repainting", status: "Pending Approval", budget: "₱30,000" },
];

const accomplishedProjects = [
    { id: 1, name: "Community Pantry Initiative", date: "Oct 2024", report: "PDF" },
    { id: 2, name: "Barangay-wide Cleanup Drive", date: "Sep 2024", report: "DOCX" },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Project Management</h1>
        <p className="text-muted-foreground">Oversee all community projects, both upcoming and accomplished.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Upcoming Projects</CardTitle>
                <CardDescription>Plan, monitor, and manage ongoing and future projects.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {upcomingProjects.map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{project.status}</TableCell>
                            <TableCell>{project.budget}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Accomplished Projects</CardTitle>
            <CardDescription>Review and download reports of completed projects.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Date Completed</TableHead>
                        <TableHead className="text-right">Download Report</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accomplishedProjects.map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{project.date}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline">Download as {project.report}</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

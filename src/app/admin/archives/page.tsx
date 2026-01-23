import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const archivedItems = [
    { id: "PROJ-001", type: "Project", name: "Community Pantry Initiative", date: "2024-11-01" },
    { id: "EVT-045", type: "Event", name: "Barangay-wide Cleanup Drive", date: "2024-10-15" },
    { id: "ANNC-102", type: "Announcement", name: "Old Water Interruption Notice", date: "2024-09-20" },
];

export default function ArchivesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Archives</h1>
        <p className="text-muted-foreground">View and manage archived data such as old projects, events, and announcements.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Archived Items</CardTitle>
            <CardDescription>This is a read-only view of data that has been archived.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date Archived</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {archivedItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs">{item.id}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

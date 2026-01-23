import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const logItems = [
    { id: 1, user: "SK Admin", action: "Updated user role for 'mariaclara' to 'Admin'.", timestamp: "2024-12-03 10:30 AM", type: "Update" },
    { id: 2, user: "SK Admin", action: "Created new project: 'Christmas Caroling for a Cause'.", timestamp: "2024-12-02 03:15 PM", type: "Create" },
    { id: 3, user: "SK Admin", action: "Deleted event: 'Youth Seminar'.", timestamp: "2024-12-01 11:00 AM", type: "Delete" },
    { id: 4, user: "System", action: "User 'juandelacruz' successfully logged in.", timestamp: "2024-12-03 09:00 AM", type: "Auth" },
];

export default function LogsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Review a chronological record of system and administrator actions.</p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Track important activities within the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.timestamp}</TableCell>
                            <TableCell className="font-medium">{item.user}</TableCell>
                            <TableCell>{item.action}</TableCell>
                             <TableCell>
                                <Badge variant={
                                    item.type === 'Create' ? 'default' : 
                                    item.type === 'Delete' ? 'destructive' : 
                                    'secondary'
                                }>{item.type}</Badge>
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

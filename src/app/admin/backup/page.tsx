import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";

export default function BackupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Backup & Restore</h1>
        <p className="text-muted-foreground">Manage data backups and restore points for your application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Backup Data</CardTitle>
                <CardDescription>Create a downloadable backup of your application data. This includes user profiles, projects, and events.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Create Full Backup
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Restore Data</CardTitle>
                <CardDescription>Restore data from a previously created backup file. This action is irreversible.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Restore from Backup File
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

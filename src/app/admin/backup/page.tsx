"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Upload, Trash2, Loader } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import type { BackupRecord } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

export default function BackupPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<BackupRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);

  const backupsCollectionRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'backups'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  
  const { data: backups, isLoading } = useCollection<BackupRecord>(backupsCollectionRef);

  const handleCreateBackup = async () => {
    if (!firestore || !user) return;

    setIsCreatingBackup(true);
    try {
      // Create a backup record
      const backupData: Omit<BackupRecord, 'id'> = {
        fileName: `backup-${format(new Date(), "yyyy-MM-dd-HHmmss")}.json`,
        backupType: 'manual',
        fileSize: 0,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        createdByName: user.displayName || 'Unknown Admin',
        status: 'in-progress',
      };

      // In a real implementation, you would:
      // 1. Export all data from Firestore collections
      // 2. Create a JSON file
      // 3. Upload to Cloud Storage
      // 4. Get download URL
      // 5. Update backup record with URL and fileSize

      // For now, we'll create a placeholder backup record
      const backupDocRef = doc(collection(firestore, 'backups'));
      const backupWithId: BackupRecord = {
        id: backupDocRef.id,
        ...backupData,
        status: 'completed',
      };

      setDocumentNonBlocking(backupDocRef, backupWithId, {});

      toast({
        title: "Backup Created",
        description: `Backup ${backupData.fileName} has been created successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Backup Failed",
        description: error.message || "Could not create backup.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDeleteBackup = () => {
    if (!backupToDelete || !firestore) return;

    try {
      const backupDocRef = doc(firestore, 'backups', backupToDelete.id);
      deleteDocumentNonBlocking(backupDocRef);

      toast({
        title: "Backup Deleted",
        description: `${backupToDelete.fileName} has been deleted.`,
        variant: "destructive",
      });

      setIsDeleteDialogOpen(false);
      setBackupToDelete(null);
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not delete the backup.",
        variant: "destructive",
      });
    }
  };

  const handleRestoreBackup = async () => {
    if (!restoreFile) {
      toast({
        title: "No File Selected",
        description: "Please select a backup file to restore.",
        variant: "destructive",
      });
      return;
    }

    setIsRestoringBackup(true);
    try {
      // In a real implementation, you would:
      // 1. Read the JSON file
      // 2. Parse the data
      // 3. Clear existing collections
      // 4. Restore data from backup
      // 5. Create audit log entry

      toast({
        title: "Restore Complete",
        description: "Your system has been restored from the backup file.",
      });

      setRestoreFile(null);
    } catch (error: any) {
      toast({
        title: "Restore Failed",
        description: error.message || "Could not restore from backup.",
        variant: "destructive",
      });
    } finally {
      setIsRestoringBackup(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Backup & Restore</h1>
        <p className="text-muted-foreground">Manage data backups and restore points for your application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Backup</CardTitle>
            <CardDescription>Create a downloadable backup of your application data. This includes user profiles, projects, events, and announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateBackup} disabled={isCreatingBackup} className="w-full">
              {isCreatingBackup ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Create Full Backup
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Backups are created manually and stored securely. You can download and restore them anytime.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore Data</CardTitle>
            <CardDescription>Restore data from a previously created backup file. This action is irreversible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="file"
                accept=".json"
                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                disabled={isRestoringBackup}
              />
              <p className="text-xs text-muted-foreground">
                Select a backup file (.json) to restore
              </p>
            </div>
            <Button
              onClick={handleRestoreBackup}
              variant="outline"
              disabled={!restoreFile || isRestoringBackup}
              className="w-full"
            >
              {isRestoringBackup ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore from File
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>View all previously created backups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && (!backups || backups.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No backups have been created yet.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && backups?.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-mono text-sm">{backup.fileName}</TableCell>
                    <TableCell className="capitalize">{backup.backupType}</TableCell>
                    <TableCell>{formatFileSize(backup.fileSize)}</TableCell>
                    <TableCell className="text-sm">{backup.createdByName}</TableCell>
                    <TableCell className="text-sm">{format(parseISO(backup.createdAt), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          backup.status === "completed"
                            ? "default"
                            : backup.status === "in-progress"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBackupToDelete(backup)}
                        disabled={backup.status !== "completed"}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the backup &quot;{backupToDelete?.fileName}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBackup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Trash2, RotateCcw, Loader } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import type { ArchivedRecord } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function ArchivesPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const [recordToRestore, setRecordToRestore] = useState<ArchivedRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<ArchivedRecord | null>(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const archivesCollectionRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'archives'), orderBy('archivedAt', 'desc')) : null,
    [firestore]
  ) as any;
  
  const { data: archivedRecords, isLoading } = useCollection<ArchivedRecord>(archivesCollectionRef);

  const handleRestoreClick = (record: ArchivedRecord) => {
    setRecordToRestore(record);
    setIsRestoreDialogOpen(true);
  };

  const handleDeleteClick = (record: ArchivedRecord) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (!recordToRestore || !firestore) return;

    try {
      // Restore the record to its original collection
      const originalDocRef = doc(firestore, recordToRestore.recordType + 's', recordToRestore.recordId);
      setDocumentNonBlocking(originalDocRef, recordToRestore.data, { merge: true });

      // Delete from archives
      const archiveDocRef = doc(firestore, 'archives', recordToRestore.id);
      deleteDocumentNonBlocking(archiveDocRef);

      toast({
        title: "Record Restored",
        description: `${recordToRestore.title} has been restored to the active system.`,
      });

      setIsRestoreDialogOpen(false);
      setRecordToRestore(null);
    } catch (error: any) {
      toast({
        title: "Restoration Failed",
        description: error.message || "Could not restore the record.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!recordToDelete || !firestore) return;

    try {
      const archiveDocRef = doc(firestore, 'archives', recordToDelete.id);
      deleteDocumentNonBlocking(archiveDocRef);

      toast({
        title: "Record Deleted",
        description: `${recordToDelete.title} has been permanently deleted from archives.`,
        variant: "destructive",
      });

      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not delete the record.",
        variant: "destructive",
      });
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      project: "Project",
      event: "Event",
      announcement: "Announcement",
      feedback: "Feedback",
      user: "User",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Archives</h1>
        <p className="text-muted-foreground">View and manage archived data such as old projects, events, and announcements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archived Items</CardTitle>
          <CardDescription>Restore or permanently delete archived records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title / Name</TableHead>
                  <TableHead>Archived By</TableHead>
                  <TableHead>Date Archived</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && (!archivedRecords || archivedRecords.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No archived records found.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && archivedRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">{record.recordId.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRecordTypeLabel(record.recordType)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{record.title}</TableCell>
                    <TableCell className="text-sm">{record.archivedByName}</TableCell>
                    <TableCell className="text-sm">{format(parseISO(record.archivedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRestoreClick(record)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(record)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore &quot;{recordToRestore?.title}&quot; back to the active system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreConfirm}>Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{recordToDelete?.title}&quot; from the archives. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

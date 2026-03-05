"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit, CheckCircle, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { ProjectForm } from "@/components/admin/project-form";
import { format, parseISO } from 'date-fns';
import { useFirebase, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import type { Project } from "@/lib/types";


export default function ProjectsPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);
  
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToMarkDone, setProjectToMarkDone] = useState<Project | null>(null);
  
  const projectsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'projects') : null, [firestore]);
  
  const upcomingProjectsQuery = useMemoFirebase(() => 
    projectsCollectionRef ? query(projectsCollectionRef, where("status", "!=", "Completed")) : null, 
  [projectsCollectionRef]);

  const accomplishedProjectsQuery = useMemoFirebase(() => 
    projectsCollectionRef ? query(projectsCollectionRef, where("status", "==", "Completed")) : null,
  [projectsCollectionRef]);

  const { data: upcomingProjects, isLoading: isLoadingUpcoming } = useCollection<Project>(upcomingProjectsQuery);
  const { data: accomplishedProjects, isLoading: isLoadingAccomplished } = useCollection<Project>(accomplishedProjectsQuery);

  const handleAddProject = () => {
    setProjectToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  }

  const handleSaveProject = (values: any) => {
    if (!firestore) return;

    const isEditing = !!projectToEdit;
    const docRef = isEditing
      ? doc(firestore, 'projects', projectToEdit.id)
      : doc(collection(firestore, 'projects'));

    const dataToSave = {
      ...values,
      id: docRef.id,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };

    setDocumentNonBlocking(docRef, dataToSave, { merge: true });
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete || !firestore) return;
    deleteDocumentNonBlocking(doc(firestore, 'projects', projectToDelete.id));
    toast({
      title: "Project deleted",
      description: `The project "${projectToDelete.name}" has been successfully deleted.`,
      variant: "destructive",
    });
    setProjectToDelete(null);
  };

  const handleDoneConfirm = () => {
    if (!projectToMarkDone || !firestore) return;
    updateDocumentNonBlocking(doc(firestore, 'projects', projectToMarkDone.id), { status: 'Completed' });
    toast({
        title: "Project Accomplished!",
        description: `"${projectToMarkDone.name}" has been moved to Accomplished Projects.`,
    });
    setProjectToMarkDone(null);
  }


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
            <Button onClick={handleAddProject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoadingUpcoming && (
                        <TableRow><TableCell colSpan={5} className="text-center"><Loader className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
                    )}
                    {upcomingProjects?.map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{format(parseISO(project.endDate), "MMM d, yyyy")}</TableCell>
                            <TableCell>{project.status}</TableCell>
                            <TableCell>{project.budget}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditClick(project)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setProjectToMarkDone(project)}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Mark as Done
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setProjectToDelete(project)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                    {isLoadingAccomplished && (
                         <TableRow><TableCell colSpan={3} className="text-center"><Loader className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
                    )}
                    {accomplishedProjects?.map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{format(parseISO(project.endDate), "MMM yyyy")}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline">Download Report</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                  <DialogTitle>{projectToEdit ? "Edit Project" : "Add New Project"}</DialogTitle>
              </DialogHeader>
              <ProjectForm
                  key={projectToEdit?.id || 'new'}
                  project={projectToEdit} 
                  onSave={handleSaveProject}
                  onClose={() => setIsFormOpen(false)} 
              />
          </DialogContent>
      </Dialog>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project titled &quot;{projectToDelete?.name}&quot;.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Mark as Done Confirmation */}
      <AlertDialog open={!!projectToMarkDone} onOpenChange={(open) => !open && setProjectToMarkDone(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Mark Project as Done?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will move the project &quot;{projectToMarkDone?.name}&quot; to the Accomplished Projects list. This action cannot be undone.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setProjectToMarkDone(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDoneConfirm}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

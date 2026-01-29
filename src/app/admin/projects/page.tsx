"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Edit, CheckCircle } from "lucide-react";
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
import { format } from 'date-fns';


export type Project = {
    id: number;
    name: string;
    status: string;
    budget: string;
    description: string;
    targetDate: string;
};

type AccomplishedProject = {
    id: number;
    name: string;
    date: string;
    report: string;
};

const initialUpcomingProjects: Project[] = [
    { id: 1, name: "Community Garden Phase 2", status: "In Progress", budget: "₱50,000", description: "Phase 2 of the community garden project.", targetDate: "2025-06-30" },
    { id: 2, name: "Youth Sports Fest 2025", status: "Planning", budget: "₱120,000", description: "Annual sports festival for the youth.", targetDate: "2025-04-15" },
    { id: 3, name: "Barangay Hall Repainting", status: "Pending Approval", budget: "₱30,000", description: "Repainting of the barangay hall.", targetDate: "2025-03-01" },
];

const initialAccomplishedProjects: AccomplishedProject[] = [
    { id: 1, name: "Community Pantry Initiative", date: "Oct 2024", report: "PDF" },
    { id: 2, name: "Barangay-wide Cleanup Drive", date: "Sep 2024", report: "DOCX" },
];

export default function ProjectsPage() {
  const [upcomingProjects, setUpcomingProjects] = useState<Project[]>(initialUpcomingProjects);
  const [accomplishedProjects, setAccomplishedProjects] = useState<AccomplishedProject[]>(initialAccomplishedProjects);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);
  
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToMarkDone, setProjectToMarkDone] = useState<Project | null>(null);

  const handleAddProject = () => {
    setProjectToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  }

  const handleSaveProject = (savedProjectData: Omit<Project, 'id' | 'targetDate'> & { id?: number; targetDate: Date | string }) => {
    
    const projectWithDateString = {
        ...savedProjectData,
        targetDate: typeof savedProjectData.targetDate === 'string' 
            ? savedProjectData.targetDate 
            : format(savedProjectData.targetDate, 'yyyy-MM-dd')
    };

    if (savedProjectData.id) {
        // Editing existing project
        setUpcomingProjects(upcomingProjects.map(p => p.id === savedProjectData.id ? { ...p, ...projectWithDateString, id: p.id } : p));
    } else {
        // Adding new project
        const newProject: Project = {
            id: Math.max(...upcomingProjects.map(p => p.id), 0) + 1,
            name: projectWithDateString.name,
            status: projectWithDateString.status,
            budget: projectWithDateString.budget,
            description: projectWithDateString.description,
            targetDate: projectWithDateString.targetDate
        };
        setUpcomingProjects([...upcomingProjects, newProject]);
    }
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete) return;
    setUpcomingProjects(upcomingProjects.filter(p => p.id !== projectToDelete.id));
    toast({
      title: "Project deleted",
      description: `The project "${projectToDelete.name}" has been successfully deleted.`,
      variant: "destructive",
    });
    setProjectToDelete(null);
  };

  const handleDoneConfirm = () => {
    if (!projectToMarkDone) return;

    // Remove from upcoming
    setUpcomingProjects(upcomingProjects.filter(p => p.id !== projectToMarkDone.id));

    // Add to accomplished
    const newAccomplishedProject: AccomplishedProject = {
        id: projectToMarkDone.id,
        name: projectToMarkDone.name,
        date: format(new Date(), 'MMM yyyy'),
        report: "PDF" // Default report type
    };
    setAccomplishedProjects([newAccomplishedProject, ...accomplishedProjects]);

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
                        <TableHead>Target Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {upcomingProjects.map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{format(new Date(project.targetDate), "MMM d, yyyy")}</TableCell>
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

      {/* Dialog for Add/Edit Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
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

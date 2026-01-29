'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/app/admin/projects/page';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  status: z.string().min(1, 'Status is required.'),
  budget: z.string().min(1, 'Budget is required.'),
  description: z.string().min(1, 'Description is required.'),
  targetDate: z.date({ required_error: 'A target date is required.' }),
  imageUrls: z.any().optional(),
});

type ProjectFormData = Omit<Project, 'id' | 'targetDate'> & { id?: number; targetDate: Date | string };

interface ProjectFormProps {
  project?: Project;
  onSave: (projectData: ProjectFormData) => void;
  onClose: () => void;
}

export function ProjectForm({ project, onSave, onClose }: ProjectFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || '',
      status: project?.status || 'Planning',
      budget: project?.budget || '₱0',
      description: project?.description || '',
      targetDate: project ? new Date(project.targetDate) : new Date(),
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isEditing = !!project;

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        onSave({ ...project, ...values });
        toast({
            title: isEditing ? 'Project Updated' : 'Project Created',
            description: `The project "${values.name}" has been saved.`,
        });
        onClose();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Could not save the project.',
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Project description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ₱50,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="targetDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Target Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Project Images</FormLabel>
                <FormControl>
                    <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
        </div>
      </form>
    </Form>
  );
}

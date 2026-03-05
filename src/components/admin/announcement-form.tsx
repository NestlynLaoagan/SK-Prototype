'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Loader } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Announcement } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
  location: z.string().optional(),
  status: z.enum(['Upcoming', 'Completed', 'Canceled', 'Ongoing']),
  type: z.enum(['general', 'assembly']),
  eventDate: z.string().optional(),
});

interface AnnouncementFormProps {
  announcement?: Announcement;
  onClose: () => void;
}

export function AnnouncementForm({ announcement, onClose }: AnnouncementFormProps) {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: announcement?.title || '',
      content: announcement?.content || '',
      location: announcement?.location || '',
      status: announcement?.status || 'Upcoming',
      type: announcement?.type || 'general',
      eventDate: announcement?.eventDate ? announcement.eventDate.slice(0, 16) : "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isEditing = !!announcement;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    try {
        const announcementsRef = collection(firestore, 'announcements');
        const docRef = isEditing ? doc(announcementsRef, announcement.id) : doc(announcementsRef);
        
        const dataToSave = {
            ...values,
            id: docRef.id,
            date: isEditing && announcement.date ? announcement.date : new Date().toISOString(),
            eventDate: values.eventDate ? new Date(values.eventDate).toISOString() : undefined,
        };

        setDocumentNonBlocking(docRef, dataToSave, { merge: true });

        toast({
            title: isEditing ? 'Announcement Updated' : 'Announcement Created',
            description: `The announcement "${values.title}" has been saved.`,
        });
        onClose();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Could not save the announcement.',
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the announcement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the announcement details" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Barangay Hall" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date & Time of Event (Optional)</FormLabel>
                <FormControl>
                    <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="assembly">Assembly</SelectItem>
                </SelectContent>
              </Select>
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
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
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

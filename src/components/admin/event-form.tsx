'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/app/admin/events/page';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, 'Event name is required.'),
  start: z.string().min(1, 'Start date and time are required.'),
  end: z.string().min(1, 'End date and time are required.'),
  status: z.string().min(1, 'Status is required.'),
});

interface EventFormProps {
  event?: Event;
  onSave: (eventData: Omit<Event, 'id'> & { id?: number }) => void;
  onClose: () => void;
}

export function EventForm({ event, onSave, onClose }: EventFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name || '',
      start: event?.start || '',
      end: event?.end || '',
      status: event?.status || 'Planning',
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isEditing = !!event;

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        onSave({ ...event, ...values });
        toast({
            title: isEditing ? 'Event Updated' : 'Event Created',
            description: `The event "${values.name}" has been saved.`,
        });
        onClose();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Could not save the event.',
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
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Start Date & Time</FormLabel>
                <FormControl>
                    <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
                <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                    <Input type="datetime-local" {...field} />
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
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Finished">Finished</SelectItem>
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

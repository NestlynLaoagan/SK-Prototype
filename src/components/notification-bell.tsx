'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { Bell, CalendarCheck, Megaphone } from 'lucide-react';
import { Separator } from './ui/separator';

export function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/80"></span>
          </span>
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have 2 unread messages.
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex items-start gap-4">
                <div className="mt-1">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium">Upcoming Event</p>
                    <p className="text-sm text-muted-foreground">
                        Barangay Assembly Day is tomorrow at 9 AM.
                    </p>
                </div>
            </div>
            <Separator />
             <div className="flex items-start gap-4">
                <div className="mt-1">
                    <Megaphone className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                    <p className="text-sm font-medium">Announcement</p>
                    <p className="text-sm text-muted-foreground">
                        New project 'Community Garden' has been posted.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import Link from 'next/link';
import { Logo } from './logo';
import { NotificationBell } from './notification-bell';
import { UserMenu } from './user-menu';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container flex h-20 items-center">
        <Logo />
        <nav className="flex-1">
            <ul className="hidden md:flex flex-1 justify-center items-center space-x-8 text-sm font-medium">
                <li><a href="#home" className="text-muted-foreground transition-colors hover:text-foreground">Home</a></li>
                <li><a href="#announcements" className="text-muted-foreground transition-colors hover:text-foreground">Announcements</a></li>
                <li><a href="#projects" className="text-muted-foreground transition-colors hover:text-foreground">Projects</a></li>
                <li><a href="#events" className="text-muted-foreground transition-colors hover:text-foreground">Events</a></li>
                <li><a href="#feedback" className="text-muted-foreground transition-colors hover:text-foreground">Feedback</a></li>
            </ul>
        </nav>
        <div className="flex items-center space-x-2">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

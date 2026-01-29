"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Home, FolderKanban, Calendar, MessageSquareQuote, Users, Bot, Shield, Archive, FileText, DatabaseBackup, Cog, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
    const pathname = usePathname();
    const auth = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast({
                title: "Signed Out",
                description: "You have been successfully signed out.",
            });
            router.replace('/admin/login');
        } catch (error) {
            console.error("Sign out failed:", error);
            toast({
                variant: "destructive",
                title: "Sign Out Failed",
                description: "Could not sign you out. Please try again.",
            });
        }
    }


  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/admin">
            <div className="flex h-20 items-center justify-center p-2">
                <div className="flex flex-col text-center">
                    <span className="font-headline text-lg font-bold leading-tight text-sidebar-foreground">BARANGAY</span>
                    <span className="font-headline text-lg font-bold leading-tight text-sidebar-foreground">BAKAKENG</span>
                    <span className="font-headline text-lg font-bold leading-tight text-sidebar-foreground">CENTRAL</span>
                </div>
            </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin">
                <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Home">
                    <Home />
                    <span>Home</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/profiles">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/profiles')} tooltip="Profiling Summary">
                    <Users />
                    <span>Profiling Summary</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/admin/projects">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/projects')} tooltip="Projects">
                    <FolderKanban />
                    <span>Projects</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/events">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/events')} tooltip="Events">
                    <Calendar />
                    <span>Events</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/admin/feedback">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/feedback')} tooltip="Feedback">
                    <MessageSquareQuote />
                    <span>Feedback</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/admin/chatbot">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/chatbot')} tooltip="AI-chatbot">
                    <Bot />
                    <span>AI-chatbot</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/admin/roles">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/roles')} tooltip="Role Management">
                    <Shield />
                    <span>Role Management</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/admin/archives">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/archives')} tooltip="Archives">
                    <Archive />
                    <span>Archives</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/admin/logs">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/logs')} tooltip="Logs">
                    <FileText />
                    <span>Logs</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/admin/backup">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/backup')} tooltip="Backup & Restore">
                    <DatabaseBackup />
                    <span>Backup & Restore</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/admin/settings">
                        <SidebarMenuButton isActive={pathname.startsWith('/admin/settings')} tooltip="Settings">
                            <Cog />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
                        <LogOut />
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

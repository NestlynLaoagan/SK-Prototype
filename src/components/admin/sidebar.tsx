"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar"
import { Home, FolderKanban, Calendar, MessageSquareQuote, Users, Bot, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
    const pathname = usePathname();

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
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

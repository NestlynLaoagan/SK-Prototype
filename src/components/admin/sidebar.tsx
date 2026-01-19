"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, FolderKanban, Calendar, MessageSquareQuote, Users, Settings, LogOut, Bot, UserCog } from "lucide-react"
import { Logo } from "../logo"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = () => {
        router.push('/login');
    }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin">
                <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Dashboard">
                    <Home />
                    <span>Dashboard</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/profiles">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/profiles')} tooltip="Profile Summary">
                    <Users />
                    <span>Profile Summary</span>
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
             <Link href="/admin/roles">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/roles')} tooltip="Role Management">
                    <UserCog />
                    <span>Role Management</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/admin/chatbot">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/chatbot')} tooltip="Chatbot">
                    <Bot />
                    <span>Chatbot</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="gap-4">
        <Separator />
         <SidebarMenu>
          <SidebarMenuItem>
             <Link href="/admin/settings">
                <SidebarMenuButton isActive={pathname.startsWith('/admin/settings')} tooltip="Settings">
                    <Settings />
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
        <Separator />
        <SidebarGroup>
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src="https://picsum.photos/seed/admin/100/100" data-ai-hint="person face" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-semibold text-sidebar-foreground">SK Admin</span>
              <span className="text-sidebar-foreground/70">Administrator</span>
            </div>
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}

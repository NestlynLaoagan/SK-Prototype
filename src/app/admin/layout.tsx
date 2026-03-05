"use client";

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
            <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
              <AdminAuthGuard>
                {children}
              </AdminAuthGuard>
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}

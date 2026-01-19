import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
            <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-secondary/30">
              <AdminAuthGuard>
                {children}
              </AdminAuthGuard>
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}

    
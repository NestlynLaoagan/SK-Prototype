import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
            <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
              {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}

    
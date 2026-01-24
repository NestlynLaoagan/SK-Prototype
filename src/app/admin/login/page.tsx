
"use client";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { RedirectIfAuthenticatedGuard } from "@/components/auth/redirect-if-authenticated-guard";

export default function AdminLoginPage() {
    return (
        <RedirectIfAuthenticatedGuard>
            <div className="flex min-h-screen w-full items-center justify-center bg-muted">
                <AdminLoginForm />
            </div>
        </RedirectIfAuthenticatedGuard>
    );
}

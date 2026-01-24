"use client";

import { AppHeader } from "@/components/app-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { MemberAuthGuard } from "@/components/auth/member-auth-guard";

export default function SettingsPage() {
    return (
        <MemberAuthGuard>
            <div className="flex flex-col min-h-screen">
                <AppHeader />
                <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-secondary/30">
                    <SettingsForm />
                </main>
            </div>
        </MemberAuthGuard>
    )
}

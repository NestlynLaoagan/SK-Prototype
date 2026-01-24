"use client";

import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const { userProfile, isProfileLoading } = useUserProfile(user);
    const router = useRouter();

    useEffect(() => {
        const stillLoading = isUserLoading || (user && isProfileLoading);
        if (stillLoading) {
            return; // Wait until all auth/profile data is loaded
        }

        // Once loading is complete...
        if (!user) {
            // No user, not authenticated, go to admin login.
            router.replace('/admin/login');
        } else if (userProfile?.role !== 'admin') {
            // User exists but is not an admin, send to public home page.
            router.replace('/home');
        }
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    // While loading, or if a redirect is imminent, show a loader.
    if (isUserLoading || (user && isProfileLoading)) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If loading is complete and user is an admin, show the content.
    if (user && userProfile?.role === 'admin') {
        return <>{children}</>;
    }

    // Fallback loader for any other case (e.g., during redirect).
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

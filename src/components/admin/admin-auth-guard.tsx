
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
        // Wait until both user and profile loading are complete
        const stillLoading = isUserLoading || (user && isProfileLoading);
        if (stillLoading) {
            return; 
        }

        // Once loading is fully complete, make routing decisions
        if (!user) {
            // No user is authenticated, redirect to the admin login page
            router.replace('/admin/login');
        } else if (userProfile?.role !== 'admin') {
            // User is authenticated but is not an admin, redirect to public home
            router.replace('/home');
        }
        // If user is an admin, do nothing and allow children to render
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    // Determine the combined loading state
    const isLoading = isUserLoading || (user && isProfileLoading);

    // While loading, show a full-page loader to prevent content flicker
    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If loading is complete and user is a confirmed admin, render the protected content
    if (user && userProfile?.role === 'admin') {
        return <>{children}</>;
    }

    // Fallback loader for edge cases, such as during the redirect triggered by the useEffect
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

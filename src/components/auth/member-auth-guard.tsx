"use client";

import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function MemberAuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const { userProfile, isProfileLoading } = useUserProfile(user);
    const router = useRouter();

    const isLoading = isUserLoading || (user && isProfileLoading);

    useEffect(() => {
        if (isLoading) {
            return; // Wait until loading is complete
        }

        // If user is not logged in at all, redirect to login page.
        if (!user) {
            router.replace('/login');
            return;
        }

        // If user is logged in and is an admin, redirect to admin dashboard.
        if (userProfile && userProfile.role === 'admin') {
            router.replace('/admin');
        }
    }, [isLoading, user, userProfile, router]);


    // While loading, show a spinner.
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    // If the user is a member, render the children.
    if (user && userProfile && userProfile.role === 'member') {
        return <>{children}</>;
    }
    
    // If the user is an admin, they are being redirected. Show a loader in the meantime.
    // Also handles the case where user exists but profile is momentarily unavailable.
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

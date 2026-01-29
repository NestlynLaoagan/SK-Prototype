
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

    const isLoading = isUserLoading || (user && isProfileLoading);

    useEffect(() => {
        if (isLoading) {
            return; // Wait until loading is complete before making any decisions
        }

        // If loading is done, check the user's status
        if (!user) {
            // Not authenticated, send to the admin login page
            router.replace('/admin/login');
        } else if (!userProfile || userProfile.role !== 'admin') {
            // Authenticated, but no profile exists OR profile is not an admin.
            // Redirect to the public homepage.
            router.replace('/home');
        }
        // If user is an admin, this effect does nothing, and the component will render its children below.
    }, [isLoading, user, userProfile, router]);


    // Only render the protected content if all loading is complete and the user is a verified admin.
    if (!isLoading && user && userProfile?.role === 'admin') {
        return <>{children}</>;
    }

    // Otherwise, render a loader. This will be shown during the initial auth check
    // and during the brief moment before a redirect occurs.
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

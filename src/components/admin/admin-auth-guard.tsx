
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
        // Wait until everything is loaded before making a routing decision
        if (isLoading) {
            return;
        }

        // If loading is complete and there's no user, redirect to the admin login page
        if (!user) {
            router.replace('/admin/login');
            return;
        }
        
        // If loading is complete, a user exists, but they are not an admin
        // (either no profile or the role is not 'admin'), redirect to the public homepage
        if (!userProfile || userProfile.role !== 'admin') {
            router.replace('/home');
            return;
        }
        // If we reach here, the user is authenticated and is an admin, so we do nothing
        // and allow the component to render its children.
    }, [isLoading, user, userProfile, router]);


    // If we are still loading, show a full-screen loader to prevent any content flicker.
    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    // After loading, if the user is a confirmed admin, render the protected content.
    // The useEffect above handles all non-admin cases.
    if (user && userProfile?.role === 'admin') {
        return <>{children}</>;
    }

    // This will be shown for a brief moment while the redirection from the useEffect is happening.
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

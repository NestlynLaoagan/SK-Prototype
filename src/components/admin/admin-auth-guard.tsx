
"use client";

import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const { userProfile, isProfileLoading } = useUserProfile(user);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Combined loading state
    const isLoading = isUserLoading || (user && isProfileLoading);

    useEffect(() => {
        // Wait until all data is loaded.
        if (isLoading) {
            setIsAuthorized(false); // Ensure not authorized while loading
            return;
        }

        // Once loading is complete, determine the outcome.
        if (user && userProfile?.role === 'admin') {
            setIsAuthorized(true);
        } else if (user && userProfile?.role !== 'admin') {
            // User is authenticated but not an admin.
            router.replace('/home');
        } else {
            // No user is authenticated.
            router.replace('/admin/login');
        }
    }, [user, userProfile, isLoading, router]);

    // Only render the children if authorization is confirmed.
    // Otherwise, show a loader to prevent flicker during redirects.
    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

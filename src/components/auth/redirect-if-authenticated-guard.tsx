
"use client";

import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * A client-side component that redirects authenticated users away from public-only pages (like login/signup).
 * It waits for both authentication and user profile loading to complete before making a routing decision.
 */
export function RedirectIfAuthenticatedGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const { userProfile, isProfileLoading } = useUserProfile(user);
    const router = useRouter();

    const isLoading = isUserLoading || (user && isProfileLoading);

    useEffect(() => {
        // Wait until all loading is done.
        if (isLoading) {
            return;
        }

        // If we have a user and their profile, they shouldn't be on this page.
        if (user && userProfile) {
            if (userProfile.role === 'admin') {
                router.replace('/admin'); // Redirect admins to their dashboard.
            } else {
                router.replace('/home'); // Redirect members to the public home.
            }
        }

    }, [user, userProfile, isLoading, router]);

    // While loading, or if a user is found (which will trigger a redirect),
    // show a full-page loader to prevent the underlying page from flashing.
    if (isLoading || user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If not loading and no user is found, render the children (e.g., the login form).
    return <>{children}</>;
}

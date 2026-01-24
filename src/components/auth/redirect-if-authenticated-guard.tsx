
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
        // Wait until all loading is done before making a decision.
        if (isLoading) {
            return;
        }

        // If we have a fully loaded user and profile, redirect them.
        if (user && userProfile) {
            if (userProfile.role === 'admin') {
                router.replace('/admin'); // Redirect admins to their dashboard.
            } else {
                router.replace('/home'); // Redirect members to the public home.
            }
        }
        // If still loading, or if there's no user, the component will show a loader
        // or the children (login form), respectively.
    }, [user, userProfile, isLoading, router]);

    // If loading is complete and there's no user, it's safe to show the login form.
    if (!isLoading && !user) {
        return <>{children}</>;
    }

    // Otherwise, show a loader. This covers both the initial loading state
    // and the period after login before the redirect in useEffect occurs.
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

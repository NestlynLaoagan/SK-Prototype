
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
        // Don't run redirection logic until all data is loaded.
        if (isLoading) {
            return;
        }

        // Case 1: No user is logged in. Redirect to the admin login page.
        if (!user) {
            router.replace('/admin/login');
            return;
        }

        // Case 2: User is logged in, but their profile doesn't exist or they are not an admin.
        // Redirect them to the public homepage.
        if (!userProfile || userProfile.role !== 'admin') {
            router.replace('/home');
            return;
        }

        // Case 3: User is logged in and is an admin. Do nothing, allow rendering.
    }, [user, userProfile, isLoading, router]);

    // If the user is a confirmed admin, show the content.
    if (!isLoading && user && userProfile?.role === 'admin') {
        return <>{children}</>;
    }

    // In all other cases (loading, or about to be redirected), show a loader
    // to prevent content from flashing and to provide a better UX.
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

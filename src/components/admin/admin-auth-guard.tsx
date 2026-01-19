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
        const isChecking = isUserLoading || isProfileLoading;
        if (!isChecking) {
            if (!user) {
                // Not logged in, redirect to admin login
                router.replace('/admin/login');
            } else if (userProfile?.role !== 'admin') {
                // Logged in but not an admin, redirect to home
                router.replace('/home');
            }
        }
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    const isAuthorized = !isUserLoading && !isProfileLoading && user && userProfile?.role === 'admin';

    if (!isAuthorized) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}

    
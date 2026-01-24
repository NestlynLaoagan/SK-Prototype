
"use client";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function AdminLoginPage() {
    const { user, isUserLoading } = useUser();
    const { userProfile, isProfileLoading } = useUserProfile(user);
    const router = useRouter();

    useEffect(() => {
        // Determine the combined loading state
        const isLoading = isUserLoading || (user && isProfileLoading);
        
        // Only perform actions once all loading is complete
        if (!isLoading && user && userProfile) {
            if (userProfile.role === 'admin') {
                // If user is already an admin, ensure they are on the dashboard
                router.replace('/admin');
            } else {
                // If user is not an admin, they should not be on this page
                router.replace('/home');
            }
        }
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    // Show a loader while checking authentication or fetching the user profile
    const isCheckingAuth = isUserLoading || (user && isProfileLoading);
    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-muted">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If loading is complete and there is no user, show the login form
    if (!user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-muted">
                <AdminLoginForm />
            </div>
        );
    }

    // Fallback loader while the redirect completes
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

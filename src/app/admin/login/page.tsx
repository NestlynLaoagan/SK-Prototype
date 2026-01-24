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
        const isLoading = isUserLoading || (user && isProfileLoading);
        // When loading is finished and we have the user's data...
        if (!isLoading && user && userProfile) {
            if (userProfile.role === 'admin') {
                // Successful login or already logged in as admin, go to dashboard.
                router.replace('/admin');
            } else {
                // Logged in as non-admin, go to public home.
                router.replace('/home');
            }
        }
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    // While we check auth status, show a loader. Also if user is logged in but we are waiting for profile.
    const isCheckingAuth = isUserLoading || (user && isProfileLoading);
    if (isCheckingAuth) {
        return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
        );
    }

    // If we are done checking and there is no user, show the login form.
    if (!user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-muted">
                <AdminLoginForm />
            </div>
        );
    }

    // Fallback loader while redirect happens
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
}

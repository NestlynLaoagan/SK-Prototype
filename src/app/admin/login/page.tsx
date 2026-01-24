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
        const isLoading = isUserLoading || isProfileLoading;
        // If user is loaded and has a profile
        if (!isLoading && user && userProfile) {
            if (userProfile.role === 'admin') {
                router.replace('/admin'); // Redirect to admin dashboard
            } else {
                // If a non-admin user somehow gets here and is logged in, send to home
                router.replace('/home');
            }
        }
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    // Show a loader while we are determining if a user is already logged in
    // and has an admin role.
    const isCheckingAuth = isUserLoading || (user && isProfileLoading);
    if (isCheckingAuth) {
        return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
        );
    }

    // If no user is logged in, show the admin login form.
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted">
            <AdminLoginForm />
        </div>
    );
}

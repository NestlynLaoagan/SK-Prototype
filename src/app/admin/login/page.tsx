
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

    const isLoading = isUserLoading || (user && isProfileLoading);

    useEffect(() => {
        if (isLoading) {
            return; // Wait until loading is complete
        }

        if (user && userProfile) {
            if (userProfile.role === 'admin') {
                router.replace('/admin'); // Already an admin, go to dashboard
            } else {
                router.replace('/home'); // Logged in as non-admin, go to home
            }
        }
    }, [user, userProfile, isLoading, router]);

    // Show loader while loading or during redirect
    if (isLoading || user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-muted">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Only show the login form if not loading and not logged in
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted">
            <AdminLoginForm />
        </div>
    );
}

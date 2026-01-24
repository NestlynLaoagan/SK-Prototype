
"use client";

import { AuthTabs } from '@/components/auth-tabs';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const { userProfile, isProfileLoading } = useUserProfile(user);
  const router = useRouter();

  useEffect(() => {
    // Determine the combined loading state
    const isLoading = isUserLoading || (user && isProfileLoading);
    
    // Only perform actions once all loading is complete
    if (!isLoading && user && userProfile) {
      if (userProfile.role === 'admin') {
        // If user is an admin, redirect to the admin dashboard
        router.replace('/admin');
      } else {
        // If user is a member, redirect to the home page
        router.replace('/home');
      }
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, router]);

  // Show a loader while checking authentication or fetching the user profile
  const isCheckingAuth = isUserLoading || (user && isProfileLoading);
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If loading is complete and there is no user, show the login UI
  if (!user) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div
          className="hidden bg-cover bg-center lg:flex"
          style={{ backgroundImage: `url('https://picsum.photos/seed/loginbg/1200/800')` }}
        >

          <div className="flex w-full flex-col items-center justify-center bg-black/60 p-8 text-center">
              <Logo />
              <h1 className="mt-4 font-headline text-5xl font-bold text-white">Barangay Bakakeng Central</h1>
              <p className="mt-2 text-neutral-200">Your one-stop portal for community engagement.</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen py-12 px-4">
          <div className="mx-auto grid w-[400px] gap-6">
            <div className="grid gap-2 text-center lg:hidden">
              <h1 className="font-headline text-5xl font-bold">Barangay Bakakeng Central</h1>
              <p className="text-balance text-muted-foreground">
                Log in or sign up to get started
              </p>
            </div>
            <AuthTabs />
          </div>
        </div>
      </div>
    );
  }

  // Fallback loader while the redirect completes
  return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
  );
}

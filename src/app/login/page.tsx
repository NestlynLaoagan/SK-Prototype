"use client";

import { AuthTabs } from '@/components/auth-tabs';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-secondary lg:flex flex-col items-center justify-center p-8 text-center">
        <Logo />
        <h1 className="font-headline text-5xl font-bold mt-4">Barangay Bakakeng Central</h1>
        <p className="text-muted-foreground mt-2">Your one-stop portal for community engagement.</p>
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

    
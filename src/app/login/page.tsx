import { AuthTabs } from '@/components/auth-tabs';
import { Logo } from '@/components/logo';

export default function LoginPage() {
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
            <h1 className="font-headline text-4xl font-bold">Barangay Bakakeng Central</h1>
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

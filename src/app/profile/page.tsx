import { ProfileForm } from "@/components/profile/profile-form";
import { AppHeader } from "@/components/app-header";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-secondary/50">
        <ProfileForm />
      </main>
    </div>
  );
}

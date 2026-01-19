import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your administrator account.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your administrator password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
            <PasswordInput placeholder="Current Password" />
            <PasswordInput placeholder="New Password" />
            <PasswordInput placeholder="Confirm New Password" />
            <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}

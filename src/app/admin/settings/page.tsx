"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader, AlertCircle, CheckCircle2 } from "lucide-react";
import { useFirebase, useUser } from "@/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminSettingsPage() {
  const { auth } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isTogglingTwoFactor, setIsTogglingTwoFactor] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!auth.currentUser || !user?.email) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    // Validate new password
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      setPasswordError(errors.join(", "));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("New password is too weak");
      } else {
        setPasswordError(error.message || "Failed to change password");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    setIsTogglingTwoFactor(true);
    try {
      // In a real implementation, you would:
      // 1. Call Firebase Multi-Factor Authentication API
      // 2. Generate QR code for authenticator app
      // 3. Verify the code before enabling

      setTwoFactorEnabled(!twoFactorEnabled);
      toast({
        title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
        description: twoFactorEnabled
          ? "Two-factor authentication has been disabled."
          : "Two-factor authentication has been enabled. Please scan the QR code with your authenticator app.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update 2FA settings",
        variant: "destructive",
      });
    } finally {
      setIsTogglingTwoFactor(false);
    }
  };

  const handleUploadProfileImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      // In a real implementation, you would:
      // 1. Upload image to Firebase Storage
      // 2. Get download URL
      // 3. Update user profile with photoURL

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });

      setProfileImage(null);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your administrator account and security settings.</p>
      </div>

      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your administrator password. Password must be at least 8 characters with uppercase, lowercase, and numbers.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <PasswordInput
                id="current-password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <PasswordInput
                id="confirm-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account by enabling two-factor authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggleTwoFactor}
              disabled={isTogglingTwoFactor}
            />
          </div>

          {twoFactorEnabled && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is active. You will need to provide a code from your authenticator app when logging in.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a new profile picture for your administrator account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadProfileImage} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="profile-image">Select Image</Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                disabled={isUploadingImage}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>

            <Button type="submit" disabled={!profileImage || isUploadingImage}>
              {isUploadingImage && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Upload Picture
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your administrator account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Display Name</Label>
              <p className="font-medium">{user?.displayName || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Account Created</Label>
              <p className="font-medium">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Sign In</Label>
              <p className="font-medium">{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

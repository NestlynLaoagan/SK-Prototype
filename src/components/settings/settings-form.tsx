
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { useUser, useFirebase } from "@/firebase"
import { updateProfile } from "firebase/auth"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "../ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PasswordInput } from "../ui/password-input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


const settingsSchema = z.object({
  profilePicture: z.any().optional(),
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
  twoFactorEnabled: z.boolean().default(false),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function SettingsForm() {
    const router = useRouter()
    const { toast } = useToast()
    const { user } = useUser()
    const { firebaseApp, auth } = useFirebase()
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            twoFactorEnabled: false,
            newPassword: "",
            confirmPassword: "",
        },
    })
    
    const { formState } = form;
    const isLoading = formState.isSubmitting;

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
            })
        }
    }, [user, form])
    
    function handleOtp() {
        toast({
            title: "OTP Sent!",
            description: "An OTP has been sent to your new number for verification.",
        })
    }

    async function onSubmit(values: z.infer<typeof settingsSchema>) {
        if (!user || !auth.currentUser) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "You need to be logged in to update your profile.",
            });
            return;
        }

        try {
            let photoURL = auth.currentUser.photoURL;

            // 1. Upload new profile picture if one was selected
            if (values.profilePicture && values.profilePicture.length > 0) {
                const file = values.profilePicture[0];
                const storage = getStorage(firebaseApp);
                const fileRef = storageRef(storage, `profile-pictures/${user.uid}`);
                
                await uploadBytes(fileRef, file);
                photoURL = await getDownloadURL(fileRef);
            }

            // 2. Update user profile in Firebase Auth
            await updateProfile(auth.currentUser, {
                displayName: values.name,
                photoURL: photoURL,
            });

            toast({
                title: "Settings Saved",
                description: "Your account details have been updated successfully.",
            });

        } catch (error: any) {
            console.error("Settings update failed:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.message || "An error occurred while saving your settings.",
            });
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Account Settings</CardTitle>
                <CardDescription>Manage your account details and security preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                             <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="profilePicture"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>Profile Picture</FormLabel>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-20 w-20">
                                                    <AvatarImage src={imagePreview || user?.photoURL || "https://picsum.photos/seed/avatar/100/100"} alt="User avatar" data-ai-hint="person face" />
                                                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <FormControl>
                                                    <Input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="max-w-sm"
                                                        {...rest}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setImagePreview(reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            } else {
                                                                setImagePreview(null);
                                                            }
                                                            onChange(e.target.files);
                                                        }}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gmail Account</FormLabel>
                                            <FormControl><Input type="email" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <div className="flex items-center gap-2">
                                                <FormControl><Input type="tel" {...field} /></FormControl>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button type="button" variant="outline" onClick={handleOtp}>Change</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Enter OTP</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Please enter the 6-digit One-Time Password sent to your new number.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <div className="flex justify-center py-4">
                                                            <Input className="max-w-xs text-center tracking-[1em]" maxLength={6} placeholder="_ _ _ _ _ _" />
                                                        </div>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction>Verify</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                        </div>
                        
                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-4">Password</h3>
                             <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl><PasswordInput {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl><PasswordInput {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                        </div>

                        <Separator />
                        
                        <div>
                             <h3 className="text-lg font-medium mb-4">Security</h3>
                             <FormField
                                control={form.control}
                                name="twoFactorEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                        Two-Factor Authentication
                                        </FormLabel>
                                        <FormDescription>
                                        Add an extra layer of security to your account.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    </FormItem>
                                )}
                                />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/home')}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

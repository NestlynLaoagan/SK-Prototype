"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

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


const settingsSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Invalid phone number."),
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

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: "Current User",
            email: "user@example.com",
            phone: "09123456789",
            twoFactorEnabled: false,
            newPassword: "",
            confirmPassword: "",
        },
    })
    
    function handleOtp() {
        toast({
            title: "OTP Sent!",
            description: "An OTP has been sent to your new number for verification.",
        })
    }

    function onSubmit(values: z.infer<typeof settingsSchema>) {
        console.log(values)
        toast({
            title: "Settings Saved",
            description: "Your account details have been updated.",
        })
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
                            <Button type="submit">Save Changes</Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/home')}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useFirebase } from "@/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { PasswordInput } from "../ui/password-input"

const formSchema = z.object({
  password: z.string().min(1, "Password is required."),
})

// This email is used to uniquely identify the single admin account.
// Changing it forces the system to create a new admin user if the old one has a password sync issue.
const ADMIN_EMAIL = "barangay.admin.connect@system.local";
const ADMIN_PASSWORD = "SKBAKAKENG@CCX23";

export function AdminLoginForm() {
  const { auth, firestore } = useFirebase()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // We only proceed if the entered password is the correct one.
    if (values.password !== ADMIN_PASSWORD) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid password.",
      });
      return;
    }

    try {
      // First, attempt to sign in with the correct credentials.
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      toast({
        title: "Login Successful",
        description: "Welcome, Admin! Redirecting...",
      });
      router.push('/admin');
    } catch (signInError: any) {
      // If sign-in fails because the user doesn't exist, we create it.
      if (signInError.code === 'auth/user-not-found') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          const newUser = newUserCredential.user;
          
          await updateProfile(newUser, { displayName: 'SK Admin' });

          // Create the user document in Firestore with the 'admin' role.
          const userDocRef = doc(firestore, "users", newUser.uid);
          await setDoc(userDocRef, {
            id: newUser.uid,
            fullName: "SK Admin",
            email: ADMIN_EMAIL,
            role: 'admin',
          });

          toast({
            title: "Admin Account Created",
            description: "Welcome, Admin! Redirecting...",
          });
          router.push('/admin');

        } catch (createError: any) {
           toast({
              variant: "destructive",
              title: "Admin Setup Failed",
              description: `Could not create admin account: ${createError.message}.`,
            });
        }
      } else if (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/wrong-password') {
          // This case handles when the account exists but the password in Firebase is wrong.
          // The fix (changing ADMIN_EMAIL) is designed to prevent this block from ever being hit again.
          toast({
              variant: "destructive",
              title: "Password Mismatch",
              description: "The admin account password in the database is out of sync. Please contact support.",
          });
      }
      else {
        // Handle other unexpected sign-in errors
         toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: signInError.message || "An unknown error occurred during login.",
        });
      }
    }
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Enter the administrator password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
  )
}

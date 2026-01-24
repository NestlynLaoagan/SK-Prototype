
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

// Use a unique, non-public email for the admin user
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
    if (values.password !== ADMIN_PASSWORD) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid password.",
      });
      return;
    }

    try {
      // Attempt to sign in.
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      toast({
        title: "Login Successful",
        description: "Welcome, Admin! Redirecting...",
      });
      router.push('/admin');
    } catch (signInError: any) {
      if (signInError.code === 'auth/user-not-found') {
        // If the user doesn't exist, create the admin account.
        // This is a one-time setup for the first admin login.
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
           // This might happen in a race condition. If it already exists now,
           // something is weird, but we can just tell the user to try again.
           toast({
              variant: "destructive",
              title: "Admin Setup Failed",
              description: `Could not create admin account: ${createError.message}. Please try logging in again.`,
            });
        }
      } else if (signInError.code === 'auth/invalid-credential') {
          // This case means the user exists in Firebase Auth, but the password is wrong.
          // This happens if the hardcoded ADMIN_PASSWORD was changed in the code, but
          // the user in Firebase Auth still has the old password.
          toast({
              variant: "destructive",
              title: "Password Mismatch",
              description: "The admin account exists, but the password you entered is incorrect. The admin password in the system may have changed.",
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

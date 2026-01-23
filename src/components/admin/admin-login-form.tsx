"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useFirebase } from "@/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Loader } from "lucide-react"

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
const ADMIN_PASSWORD = "HPGMHVXBCCX23";

export function AdminLoginForm() {
  const { auth, firestore } = useFirebase()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  const isLoading = form.formState.isSubmitting;

  const handleSuccessfulAdminLogin = () => {
    toast({
      title: "Login Successful",
      description: "Welcome, Admin!",
    })
    // The redirect is now handled by the parent /login page component
    // which listens for auth state changes and user roles.
  }

  const handleAccessDenied = async () => {
    if (auth.currentUser) {
      await auth.signOut();
    }
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "You do not have administrative privileges.",
    });
  }

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
      // First, try to sign in with the correct, hardcoded password
      const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === 'admin') {
        handleSuccessfulAdminLogin();
      } else {
        // This case is unlikely if the DB is consistent, but handles it.
        handleAccessDenied();
      }
    } catch (signInError: any) {
      // If sign-in fails, it's likely because the user doesn't exist yet.
      // We've already verified the password, so we can proceed to create the account.
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          const newUser = newUserCredential.user;
          
          await updateProfile(newUser, { displayName: 'SK Admin' });

          const userDocRef = doc(firestore, "users", newUser.uid);
          await setDoc(userDocRef, {
            id: newUser.uid,
            fullName: "SK Admin",
            email: ADMIN_EMAIL,
            role: 'admin',
          });

          // Creation was successful, so log them in.
          handleSuccessfulAdminLogin();

        } catch (createError: any) {
           // This might happen in a race condition, but it's very unlikely.
           // It means the account was created between the signIn and createUser calls.
           if (createError.code === 'auth/email-already-in-use') {
              // We can just try to log in again.
              handleSuccessfulAdminLogin();
           } else {
             // Handle other potential errors during user creation
             toast({
                variant: "destructive",
                title: "Admin Setup Failed",
                description: `Could not create admin account: ${createError.message}`,
              });
           }
        }
      } else {
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

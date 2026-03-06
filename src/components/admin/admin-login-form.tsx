
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

const ADMIN_EMAIL = "barangay.admin.connect.v3@system.local";
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
    try {
      // First, try to sign in with the provided password.
      const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, values.password);
      const user = userCredential.user;

      // On successful login, ensure the user exists in the /admins collection to grant permissions.
      const adminDocRef = doc(firestore, "admins", user.uid);
      await setDoc(adminDocRef, { email: user.email, uid: user.uid }, { merge: true });

      toast({
        title: "Login Successful",
        description: "Welcome, Admin! You will be redirected shortly.",
      });

    } catch (error: any) {
      // If sign-in fails because the user doesn't exist, and the password is the initial setup password...
      if ((error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') && values.password === ADMIN_PASSWORD) {
        try {
          // ...create the admin account.
          const newUserCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          const newUser = newUserCredential.user;
          
          await updateProfile(newUser, { displayName: 'SK Admin' });

          // Create the user document in /users
          const userDocRef = doc(firestore, "users", newUser.uid);
          await setDoc(userDocRef, {
            id: newUser.uid,
            fullName: "SK Admin",
            email: ADMIN_EMAIL,
            role: 'admin',
          });
          
          // Also create the document in the /admins collection to grant permissions.
          const adminDocRef = doc(firestore, "admins", newUser.uid);
          await setDoc(adminDocRef, { email: newUser.email, uid: newUser.uid });

          toast({
            title: "Admin Account Created",
            description: "Welcome, Admin! You will be redirected shortly.",
          });

        } catch (createError: any) {
           toast({
              variant: "destructive",
              title: "Admin Setup Failed",
              description: `Could not create admin account: ${createError.message}.`,
            });
        }
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        // Handle incorrect password for an existing admin account.
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Invalid password.",
        });
      } else {
        // Handle other unexpected sign-in errors
         toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: error.message || "An unknown error occurred during login.",
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

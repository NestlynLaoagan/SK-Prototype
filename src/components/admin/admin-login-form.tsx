"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
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

const ADMIN_USERNAME = "SkAdmin@372822023";

export function AdminLoginForm() {
  const router = useRouter()
  const { auth, firestore } = useFirebase()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "HPGMHVXBCCX23",
    },
  })

  const isLoading = form.formState.isSubmitting;

  const handleSuccessfulAdminLogin = () => {
    toast({
      title: "Login Successful",
      description: "Welcome, Admin!",
    })
    router.push("/admin")
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, ADMIN_USERNAME, values.password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === 'admin') {
        handleSuccessfulAdminLogin();
      } else {
        handleAccessDenied();
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, ADMIN_USERNAME, values.password);
          const newUser = newUserCredential.user;
          
          await updateProfile(newUser, { displayName: 'SK Admin' });

          const userDocRef = doc(firestore, "users", newUser.uid);
          await setDoc(userDocRef, {
            id: newUser.uid,
            fullName: "SK Admin",
            email: ADMIN_USERNAME,
            role: 'admin',
          });

          handleSuccessfulAdminLogin();

        } catch (createError: any) {
          toast({
            variant: "destructive",
            title: "Admin Setup Failed",
            description: `Could not create admin account: ${createError.message}`,
          });
        }
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
         toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Invalid password.",
          });
      } else {
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


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export function AuthTabs() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md mt-8">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="login">Log In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="signup">
        <SignupForm />
      </TabsContent>
      <TabsContent value="admin">
        <AdminLoginForm />
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollection, useFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { User as UserModel } from "@/lib/types";

const ADMIN_PASSWORD = "HPGMHVXBCCX23";

export default function RolesPage() {
  const { firestore } = useFirebase();
  const usersRef = collection(firestore, 'users');
  const { data: users, isLoading } = useCollection<UserModel>(usersRef);

  const [localUsers, setLocalUsers] = useState<UserModel[]>([]);
  const [userToUpdate, setUserToUpdate] = useState<UserModel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const { toast } = useToast();

  useState(() => {
    if (users) {
      setLocalUsers(users);
    }
  });

  const handleRoleChange = (userId: string, role: "member" | "admin") => {
    setLocalUsers(prev => prev.map(user => user.id === userId ? { ...user, role } : user));
  };

  const handleSaveClick = (userId: string) => {
    const user = localUsers.find(u => u.id === userId);
    if (user) {
      setUserToUpdate(user);
      setIsAlertOpen(true);
    }
  };

  const handleConfirmRoleChange = () => {
    if (adminPassword !== ADMIN_PASSWORD) {
        toast({
            title: "Verification Failed",
            description: "Incorrect admin password. Role change was not saved.",
            variant: "destructive",
        });
    } else {
        if (userToUpdate) {
            const userDocRef = doc(firestore, 'users', userToUpdate.id);
            updateDocumentNonBlocking(userDocRef, { role: userToUpdate.role });
            toast({
                title: "Role Saved",
                description: `Role for ${userToUpdate.fullName} has been updated to ${userToUpdate.role}.`,
            });
        }
    }
    handleCancelRoleChange();
  };

  const handleCancelRoleChange = () => {
    setAdminPassword("");
    setUserToUpdate(null);
    setIsAlertOpen(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Role Management</h1>
        <p className="text-muted-foreground">Assign and manage user roles within the system.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Change user roles from Member to Admin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-8" />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                <Loader className="mx-auto h-6 w-6 animate-spin" />
                            </TableCell>
                        </TableRow>
                    )}
                    {localUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select value={user.role} onValueChange={(value: "member" | "admin") => handleRoleChange(user.id, value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button onClick={() => handleSaveClick(user.id)}>Save</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Admin Verification Required</AlertDialogTitle>
                <AlertDialogDescription>
                    To save this role change, please enter the administrator password.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
                <Input
                    id="admin-password"
                    type="password"
                    placeholder="Admin Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmRoleChange()}
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelRoleChange}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmRoleChange}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </div>
  );
}

    
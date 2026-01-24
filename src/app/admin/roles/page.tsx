"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useCollection, useFirebase, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { User as UserModel } from "@/lib/types";
import { PasswordInput } from "@/components/ui/password-input";

const ADMIN_PASSWORD = "SKBAKAKENG@CCX23";

export default function RolesPage() {
  const { firestore } = useFirebase();
  const usersCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, isLoading } = useCollection<UserModel>(usersCollectionRef);

  const [localUsers, setLocalUsers] = useState<UserModel[]>([]);
  const [userToUpdate, setUserToUpdate] = useState<UserModel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (users) {
      setLocalUsers(users);
    }
  }, [users]);

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
        // Don't close the dialog on failure
        return; 
    }
    
    if (userToUpdate) {
        const userDocRef = doc(firestore, 'users', userToUpdate.id);
        // Use non-blocking update
        updateDocumentNonBlocking(userDocRef, { role: userToUpdate.role }, { merge: true });
        toast({
            title: "Role Saved",
            description: `Role for ${userToUpdate.fullName} has been updated to ${userToUpdate.role}.`,
        });
    }
    
    handleCancelRoleChange();
  };

  const handleCancelRoleChange = () => {
    setAdminPassword("");
    setUserToUpdate(null);
    setIsAlertOpen(false);
  }

  const filteredUsers = useMemo(() => {
    if (!localUsers) return [];
    return localUsers.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [localUsers, searchTerm]);

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
                <Input 
                    placeholder="Search users by name or email..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                                <div className="flex justify-center items-center p-4">
                                  <Loader className="h-6 w-6 animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && filteredUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select 
                                  value={user.role} 
                                  onValueChange={(value: "member" | "admin") => handleRoleChange(user.id, value)}
                                  disabled={user.email === 'barangay.admin.connect.v3@system.local'}
                                >
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
                                <Button 
                                  onClick={() => handleSaveClick(user.id)}
                                  disabled={user.email === 'barangay.admin.connect.v3@system.local' || users?.find(u => u.id === user.id)?.role === user.role}
                                >
                                  Save
                                </Button>
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
                <PasswordInput
                    id="admin-password"
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

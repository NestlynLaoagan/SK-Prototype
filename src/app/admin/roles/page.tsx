"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
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
import { PasswordInput } from "@/components/ui/password-input";

type User = {
    id: number;
    name: string;
    username: string;
    role: "Member" | "Admin";
};

const initialUsers: User[] = [
    { id: 1, name: "Juan Dela Cruz", username: "juandelacruz", role: "Member" },
    { id: 2, name: "Maria Clara", username: "mariaclara", role: "Member" },
    { id: 3, name: "Crisostomo Ibarra", username: "crisostomo", role: "Member" },
];

const ADMIN_PASSWORD = "HPGMHVXBCCX23";

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userToUpdate, setUserToUpdate] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const { toast } = useToast();

  const handleRoleChange = (userId: number, role: "Member" | "Admin") => {
    setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
  };

  const handleSaveClick = (userId: number) => {
    setUserToUpdate(userId);
    setIsAlertOpen(true);
  };

  const handleConfirmRoleChange = () => {
    if (adminPassword !== ADMIN_PASSWORD) {
        toast({
            title: "Verification Failed",
            description: "Incorrect admin password. Role change was not saved.",
            variant: "destructive",
        });
    } else {
        if (userToUpdate !== null) {
            const user = users.find(u => u.id === userToUpdate);
            toast({
                title: "Role Saved",
                description: `Role for ${user?.name} has been updated to ${user?.role}.`,
            });
            // In a real app, you would make an API call here.
        }
    }
    // Reset state and close dialog
    setAdminPassword("");
    setUserToUpdate(null);
    setIsAlertOpen(false);
  };

  const handleCancelRoleChange = () => {
    // Reset state and close dialog
    setAdminPassword("");
    setUserToUpdate(null);
    setIsAlertOpen(false);
  }

  const handleOpenChange = (open: boolean) => {
      setIsAlertOpen(open);
      if (!open) {
        // Reset state if dialog is closed without action
        setAdminPassword("");
        setUserToUpdate(null);
      }
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
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>
                                <Select value={user.role} onValueChange={(value: "Member" | "Admin") => handleRoleChange(user.id, value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Member">Member</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
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
      <AlertDialog open={isAlertOpen} onOpenChange={handleOpenChange}>
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

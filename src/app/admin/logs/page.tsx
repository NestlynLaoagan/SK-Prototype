"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Loader } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { AuditLog } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function LogsPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterAction, setFilterAction] = useState("all");

  const logsCollectionRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'logs'), orderBy('timestamp', 'desc')) : null,
    [firestore]
  ) as any;
  
  const { data: logs, isLoading } = useCollection<AuditLog>(logsCollectionRef);

  const uniqueUsers = useMemo(() => {
    if (!logs) return [];
    return [...new Set(logs.map(log => log.userName))];
  }, [logs]);

  const uniqueModules = useMemo(() => {
    if (!logs) return [];
    return [...new Set(logs.map(log => log.module))];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log => {
      const matchesSearch = searchTerm === "" || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = filterUser === "all" || log.userName === filterUser;
      const matchesModule = filterModule === "all" || log.module === filterModule;
      const matchesAction = filterAction === "all" || log.status === filterAction;
      
      return matchesSearch && matchesUser && matchesModule && matchesAction;
    });
  }, [logs, searchTerm, filterUser, filterModule, filterAction]);

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no logs matching your filters.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ["Timestamp", "User", "Role", "Action", "Module", "Description", "Status"];
    const rows = filteredLogs.map(log => [
      format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
      log.userName,
      log.userRole,
      log.action,
      log.module,
      log.description,
      log.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: `${filteredLogs.length} log entries exported.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Audit Trail</h1>
        <p className="text-muted-foreground">Review a chronological record of system and administrator actions.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Track important activities within the admin panel.</CardDescription>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {uniqueModules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No logs found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{format(parseISO(log.timestamp), "MMM d, yyyy HH:mm:ss")}</TableCell>
                    <TableCell className="font-medium">{log.userName}</TableCell>
                    <TableCell className="capitalize">{log.userRole}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.description}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {!isLoading && filteredLogs.length > 0 && (
            <div className="text-sm text-muted-foreground text-right">
              Showing {filteredLogs.length} of {logs?.length || 0} log entries
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

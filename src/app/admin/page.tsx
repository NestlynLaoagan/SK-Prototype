import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Calendar, Users, Megaphone } from "lucide-react";

export default function AdminDashboardPage() {
    const stats = [
        { title: "Upcoming Events", value: "3", icon: Calendar, color: "text-blue-500" },
        { title: "Finished Projects", value: "12", icon: FolderKanban, color: "text-green-500" },
        { title: "Community Members", value: "450", icon: Users, color: "text-yellow-500" },
        { title: "Announcements", value: "5", icon: Megaphone, color: "text-purple-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of your community's activities.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

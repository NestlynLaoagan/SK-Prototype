import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardCheck, Calendar, Users, Megaphone, PlusCircle } from "lucide-react";

export default function AdminDashboardPage() {
    const stats = [
        { title: "Upcoming Events", value: "12", icon: Calendar },
        { title: "Finished Projects", value: "45", icon: ClipboardCheck },
        { title: "Community Members", value: "1,234", icon: Users },
        { title: "Announcements", value: "8", icon: Megaphone },
    ];

    const announcements = [
        { title: "Community meeting scheduled for next week", posted: "Posted 2 days ago" },
        { title: "New vaccination drive announced", posted: "Posted 5 days ago" },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                    <Card key={stat.title} className="bg-accent">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-accent-foreground">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 text-primary`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Announcements</CardTitle>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Announcement
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {announcements.map((ann, index) => (
                        <Card key={index} className="bg-accent p-4">
                            <p className="font-medium text-accent-foreground">{ann.title}</p>
                            <p className="text-sm text-muted-foreground">{ann.posted}</p>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

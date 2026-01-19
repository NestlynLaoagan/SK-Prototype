import { FeedbackAnalysis } from "@/components/admin/feedback-analysis";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FeedbackPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Feedback Hub</h1>
                    <p className="text-muted-foreground">Analyze and manage user feedback.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filter by:</span>
                    <Select defaultValue="monthly">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
            
            <FeedbackAnalysis />
        </div>
    )
}

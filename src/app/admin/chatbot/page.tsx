import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
    { id: 1, question: "How do I get a barangay clearance?", answer: "To get a barangay clearance, please visit the barangay hall with a valid ID and pay the corresponding fee." },
    { id: 2, question: "What are the office hours?", answer: "The barangay hall is open from Monday to Friday, 8:00 AM to 5:00 PM." },
    { id: 3, question: "How to report an issue?", answer: "You can report issues through the feedback form on our website or by visiting the barangay hall directly." },
];

export default function ChatbotPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">ISKAI Chatbot Management</h1>
        <p className="text-muted-foreground">Manage the questions and answers for the AI-powered FAQ chatbot.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage FAQs</CardTitle>
                <CardDescription>Add, edit, or delete frequently asked questions.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add FAQ
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30%]">Question</TableHead>
                        <TableHead className="w-[50%]">Answer</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {faqs.map(faq => (
                        <TableRow key={faq.id}>
                            <TableCell className="font-medium">
                                <Textarea defaultValue={faq.question} className="h-24" />
                            </TableCell>
                            <TableCell>
                                <Textarea defaultValue={faq.answer} className="h-24" />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

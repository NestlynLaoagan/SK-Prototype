"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const initialFaqs = [
    { id: 1, question: "How do I get a barangay clearance?", answer: "To get a barangay clearance, please visit the barangay hall with a valid ID and pay the corresponding fee." },
    { id: 2, question: "What are the office hours?", answer: "The barangay hall is open from Monday to Friday, 8:00 AM to 5:00 PM." },
    { id: 3, question: "How to report an issue?", answer: "You can report issues through the feedback form on our website or by visiting the barangay hall directly." },
];

type FAQ = {
    id: number;
    question: string;
    answer: string;
}

export default function ChatbotPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const { toast } = useToast();

  const handleAddFaq = () => {
    const newFaq = {
      id: faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1,
      question: "",
      answer: "",
    };
    setFaqs([...faqs, newFaq]);
    toast({
      title: "New FAQ added",
      description: "A new FAQ row has been added. Please fill in the details.",
    });
  };

  const handleDeleteFaq = (id: number) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    toast({
      title: "FAQ deleted",
      description: "The FAQ has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleFaqChange = (id: number, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map(faq => faq.id === id ? { ...faq, [field]: value } : faq));
  };

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
            <Button onClick={handleAddFaq}>
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
                                <Textarea value={faq.question} onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)} className="h-24" />
                            </TableCell>
                            <TableCell>
                                <Textarea value={faq.answer} onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)} className="h-24" />
                            </TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleDeleteFaq(faq.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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

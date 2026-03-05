
"use client";

import { useState } from "react";
import { useFirebase, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Faq } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Trash2, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";

export default function ChatbotPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const faqsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'faqs') : null, [firestore]);
  const { data: faqs, isLoading } = useCollection<Faq>(faqsCollectionRef);

  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

  const handleAddFaq = () => {
    if (!firestore) return;
    const newDocRef = doc(collection(firestore, 'faqs'));
    const newFaq: Faq = {
      id: newDocRef.id,
      question: "New Question...",
      answer: "New Answer...",
    };
    
    setDocumentNonBlocking(newDocRef, newFaq, {});
    
    toast({
      title: "New FAQ added",
      description: "A new FAQ row has been added. Please fill in the details.",
    });
  };

  const handleDeleteConfirm = () => {
    if (!faqToDelete || !firestore) return;
    const docRef = doc(firestore, 'faqs', faqToDelete.id);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "FAQ deleted",
      description: "The FAQ has been successfully deleted.",
      variant: "destructive",
    });
    setFaqToDelete(null);
  };
  
  const handleSaveOnBlur = (id: string, field: 'question' | 'answer', value: string) => {
    if (!firestore) return;
    const faqToSave = faqs?.find(f => f.id === id);
    if (faqToSave && faqToSave[field] !== value) {
        const docRef = doc(firestore, 'faqs', id);
        setDocumentNonBlocking(docRef, { [field]: value }, { merge: true });
        toast({
            title: "FAQ Saved",
            description: "Your changes have been saved automatically.",
        })
    }
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
                <CardDescription>Add, edit, or delete frequently asked questions. Changes are saved automatically on blur.</CardDescription>
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
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                <div className="flex justify-center p-8">
                                    <Loader className="h-6 w-6 animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && faqs?.map(faq => (
                        <TableRow key={faq.id}>
                            <TableCell className="font-medium">
                                <Textarea 
                                    defaultValue={faq.question} 
                                    onBlur={(e) => handleSaveOnBlur(faq.id, 'question', e.target.value)}
                                    className="h-24" />
                            </TableCell>
                            <TableCell>
                                <Textarea 
                                    defaultValue={faq.answer} 
                                    onBlur={(e) => handleSaveOnBlur(faq.id, 'answer', e.target.value)}
                                    className="h-24" />
                            </TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setFaqToDelete(faq)} className="text-destructive">
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

      <AlertDialog open={!!faqToDelete} onOpenChange={(open) => !open && setFaqToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this FAQ.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setFaqToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

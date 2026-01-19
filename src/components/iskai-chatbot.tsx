"use client";
import { useState } from "react";
import { Bot, Send, X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { askIskai, type FaqChatbotInput, type FaqChatbotOutput } from "@/ai/flows/faq-chatbot";


type Message = {
    role: 'user' | 'bot';
    text: string;
};

export function IskaiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const aiInput: FaqChatbotInput = { question: input };
        const response: FaqChatbotOutput = await askIskai(aiInput);

        const botMessage: Message = { role: 'bot', text: response.answer };
        setMessages(prev => [...prev, botMessage]);

        toast({
            title: "Feedback sent!",
        });
    } catch (error) {
        console.error("AI error:", error);
        const errorMessage: Message = { role: 'bot', text: "Sorry, I couldn't process your request right now." };
        setMessages(prev => [...prev, errorMessage]);
        toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem contacting the AI.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full w-16 h-16 shadow-lg">
            <Bot className="h-8 w-8" />
            <span className="sr-only">Open Chatbot</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
                <Bot />
                ISKAI - Your Barangay Assistant
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 p-4 -mx-6">
            <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'bot' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg px-3 py-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-secondary">
                        <Loader className="w-5 h-5 animate-spin" />
                    </div>
                </div>
             )}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 p-4 -mx-6 border-t">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button onClick={handleSend} size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

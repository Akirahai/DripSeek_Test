'use client';

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/types';
import { getFashionAssistanceAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles, X } from 'lucide-react';
import { FashionSuggestionsDisplay } from './fashion-suggestions-display';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialContext?: string; // e.g., keywords from DripSeek
}

export function AIAssistantPanel({ isOpen, onOpenChange, initialContext }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialContext && isOpen) {
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: `Keywords found: "${initialContext}". What would you like to know about the fashion in this scene? Ask about specific items, styles, or where to find them! You can also browse suggestions below.`,
          timestamp: new Date(),
        },
      ]);
    } else if (isOpen && messages.length === 0) {
       setMessages([
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: `Hi! I'm your Fashion Decoder assistant. Ask me anything about fashion!`,
          timestamp: new Date(),
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContext, isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getFashionAssistanceAction({ question: inputValue, context: initialContext });
      if (response.success && response.data) {
        let aiResponseText = response.data.answer;
        if (response.data.searchLink) {
          // Append the search link to the AI's answer.
          // For simplicity, we're adding it as plain text. A more advanced implementation
          // might use Markdown rendering to make it a clickable link.
          aiResponseText += `\n\nShop similar items: ${response.data.searchLink}`;
        }
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get assistance.');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col" side="right">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="flex items-center text-2xl font-headline">
            <Sparkles size={28} className="mr-2 text-primary" /> Fashion AI Assistant
          </SheetTitle>
          <SheetDescription>
            Ask about items, styles, or get fashion advice. If DripSeek identified items, context is automatically included.
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="chat" className="flex-grow flex flex-col min-h-0">
          <TabsList className="mx-6 mt-4 grid w-auto grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-grow flex flex-col min-h-0 p-6 pt-2 data-[state=inactive]:hidden">
            <ScrollArea ref={scrollAreaRef} className="flex-grow mb-4 pr-4 -mr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={18} /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 shadow ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                     {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={18} /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback><Bot size={18}/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg px-4 py-3 bg-muted text-muted-foreground shadow">
                      <p className="text-sm italic">Fashion Decoder is thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="mt-auto flex gap-2 border-t pt-4">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about fashion..."
                className="flex-grow resize-none"
                rows={1}
                aria-label="Chat input"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} aria-label="Send message">
                <Send size={18} />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="flex-grow overflow-y-auto data-[state=inactive]:hidden">
            <FashionSuggestionsDisplay />
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="p-6 border-t">
          <SheetClose asChild>
            <Button variant="outline"> <X size={16} className="mr-1"/> Close Panel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

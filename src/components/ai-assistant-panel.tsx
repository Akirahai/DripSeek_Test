
'use client';

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/types';
import { getFashionAssistanceAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles, X, Paperclip, XCircle } from 'lucide-react';
import { FashionSuggestionsDisplay } from './fashion-suggestions-display';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image'; // For Next.js optimized images, if applicable for data URIs. Otherwise, standard img.
import { Input } from '@/components/ui/input';


interface AIAssistantPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialContext?: string; // e.g., keywords from DripSeek
}

export function AIAssistantPanel({ isOpen, onOpenChange, initialContext }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageDataUri, setSelectedImageDataUri] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          text: `Hi! I'm your Fashion Decoder assistant. Ask me anything about fashion, or attach an image for more specific help!`,
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageDataUri(reader.result as string);
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Image Read Error',
          description: 'Could not read the selected image. Please try another file.',
        });
        setSelectedImageDataUri(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again after removing it
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageDataUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((inputValue.trim() === '' && !selectedImageDataUri) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
      imageDataUri: selectedImageDataUri || undefined,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    const currentInputValue = inputValue;
    const currentSelectedImageDataUri = selectedImageDataUri;

    setInputValue('');
    setSelectedImageDataUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    try {
      const response = await getFashionAssistanceAction({
        question: currentInputValue,
        context: messages.length > 0 && messages[0].sender === 'ai' && messages[0].text.startsWith('Keywords found:') ? initialContext : undefined, // Pass DripSeek context if it was the first message
        photoDataUri: currentSelectedImageDataUri || undefined,
      });

      if (response.success && response.data) {
        let aiResponseText = response.data.answer;
        if (response.data.searchLink) {
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
            Ask about items, styles, or get fashion advice. Upload an image for more specific help!
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
                      <Avatar className="h-8 w-8 self-start"> {/* Align AI avatar to top */}
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
                      {message.imageDataUri && message.sender === 'user' && (
                        // Using standard img for data URIs as next/image might require configuration for them
                        // or specific loader props. Keep it simple for now.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={message.imageDataUri}
                          alt="User upload"
                          className="max-w-full h-auto rounded-md mb-2 max-h-60 object-contain"
                        />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                     {message.sender === 'user' && (
                      <Avatar className="h-8 w-8 self-start"> {/* Align User avatar to top */}
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
            
            {selectedImageDataUri && (
              <div className="mb-2 p-2 border rounded-md relative bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Attached image:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImageDataUri}
                  alt="Selected preview"
                  className="max-w-full h-auto rounded max-h-28 object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <XCircle size={16} />
                </Button>
              </div>
            )}

            <div className="mt-auto flex gap-2 border-t pt-4">
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
                id="chat-image-upload"
                aria-label="Upload image for chat"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()} 
                aria-label="Attach image"
                disabled={isLoading}
              >
                <Paperclip size={18} />
              </Button>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={selectedImageDataUri ? "Add a comment about the image..." : "Ask about fashion..."}
                className="flex-grow resize-none"
                rows={1}
                aria-label="Chat input"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || (inputValue.trim() === '' && !selectedImageDataUri)} 
                aria-label="Send message"
              >
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

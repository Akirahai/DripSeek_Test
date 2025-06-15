
'use client';

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage, XRayFashionItem } from '@/lib/types';
import { getFashionAssistanceAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles, X, Paperclip, XCircle, List, MessageSquare, ShoppingBag } from 'lucide-react';
import { FashionSuggestionsDisplay } from './fashion-suggestions-display';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For IdentifiedItems tab

interface AIAssistantPanelProps {
  isOpen: boolean; // Could be used for initial open state or animations
  onCloseRequest: () => void; // Callback to inform parent to close the panel
  initialContext?: string;
  identifiedItems: XRayFashionItem[];
  onItemClickedForChat: (item: XRayFashionItem) => void;
  initialActiveTab?: 'chat' | 'identified' | 'suggestions';
  onActiveTabChange?: (tab: 'chat' | 'identified' | 'suggestions') => void;
}

export function AIAssistantPanel({ 
  isOpen, 
  onCloseRequest, 
  initialContext, 
  identifiedItems, 
  onItemClickedForChat,
  initialActiveTab = 'chat',
  onActiveTabChange
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageDataUri, setSelectedImageDataUri] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'identified' | 'suggestions'>(initialActiveTab);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  useEffect(() => {
    if (initialContext && isOpen) {
      // Only add initial context message if chat tab is active
      // and the message isn't already the one we intend to add or messages are empty.
      if (activeTab === 'chat' && 
          (messages.length === 0 || 
           (messages.length > 0 && messages[0].text !== `Context: "${initialContext}". What would you like to know? Ask about specific items, styles, or where to find them!`))) {
        setMessages([
          {
            id: Date.now().toString(),
            sender: 'ai',
            text: `Context: "${initialContext}". What would you like to know? Ask about specific items, styles, or where to find them!`,
            timestamp: new Date(),
          },
        ]);
      }
    } else if (isOpen && messages.length === 0 && activeTab === 'chat') {
       setMessages([
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: `Hi! I'm your Fashion Decoder assistant. Ask me anything about fashion, or attach an image for more specific help!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialContext, isOpen, activeTab, messages]);

  useEffect(() => {
    if (scrollAreaRef.current && activeTab === 'chat') {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, activeTab]);

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
    setSelectedImageDataUri(null); // Clear after sending
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    try {
      const response = await getFashionAssistanceAction({
        question: currentInputValue,
        context: initialContext, 
        photoDataUri: currentSelectedImageDataUri || undefined,
      });

      if (response.success && response.data) {
        let aiResponseText = response.data.answer;
        if (response.data.searchLink) {
          aiResponseText += `\n\nShop similar items: [${response.data.searchLink}](${response.data.searchLink})`;
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

  const handleIdentifiedItemClick = (item: XRayFashionItem) => {
    onItemClickedForChat(item);
    setActiveTab('chat');
    if (onActiveTabChange) onActiveTabChange('chat');
  };
  
  const handleTabChange = (value: string) => {
    const newTab = value as 'chat' | 'identified' | 'suggestions';
    setActiveTab(newTab);
    if (onActiveTabChange) onActiveTabChange(newTab);
  };

  if (!isOpen) return null; // Panel is controlled by parent's layout

  return (
    <div className="bg-card border border-border rounded-lg shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles size={24} className="mr-2 text-primary" />
          <h2 className="text-xl font-headline">Fashion Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onCloseRequest} aria-label="Close panel">
          <X size={20} />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-grow flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 grid w-auto grid-cols-3">
          <TabsTrigger value="chat"><MessageSquare size={16} className="mr-1.5"/>Chat</TabsTrigger>
          <TabsTrigger value="identified"><List size={16} className="mr-1.5"/>Items</TabsTrigger>
          <TabsTrigger value="suggestions"><ShoppingBag size={16} className="mr-1.5"/>Explore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-grow flex flex-col min-h-0 p-4 data-[state=inactive]:hidden">
          <ScrollArea ref={scrollAreaRef} className="flex-grow mb-4 pr-2 -mr-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback><Bot size={18} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.imageDataUri && message.sender === 'user' && (
                      <img
                        src={message.imageDataUri}
                        alt="User upload"
                        className="max-w-full h-auto rounded-md mb-2 max-h-48 object-contain"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 self-start">
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
                  <div className="max-w-[75%] rounded-lg px-3 py-2 bg-muted text-muted-foreground shadow-sm">
                    <p className="text-sm italic">Fashion Decoder is thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {selectedImageDataUri && (
            <div className="mb-2 p-2 border rounded-md relative bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Attached image:</p>
              <img
                src={selectedImageDataUri}
                alt="Selected preview"
                className="max-w-full h-auto rounded max-h-24 object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-5 w-5 text-muted-foreground hover:text-destructive"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <XCircle size={14} />
              </Button>
            </div>
          )}

          <div className="mt-auto flex gap-2 border-t pt-3">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
              id="chat-image-upload-panel"
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

        <TabsContent value="identified" className="flex-grow overflow-y-auto p-4 data-[state=inactive]:hidden">
          <ScrollArea className="h-full pr-2 -mr-2">
            <div className="space-y-3">
              {identifiedItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No items identified from the scene yet.</p>
              )}
              {identifiedItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer border"
                  onClick={() => handleIdentifiedItemClick(item)}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleIdentifiedItemClick(item)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="relative w-16 h-20 rounded overflow-hidden shrink-0 bg-white">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={item.dataAiHint || 'fashion item'}
                      />
                    </div>
                    <div className="flex-grow">
                      <CardTitle className="text-sm font-semibold text-card-foreground mb-0.5">{item.name}</CardTitle>
                      {item.description && <p className="text-xs text-muted-foreground mb-1 truncate">{item.description}</p>}
                       <p className="text-xs text-primary hover:underline">Ask AI about this</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="suggestions" className="flex-grow overflow-y-auto data-[state=inactive]:hidden">
          <FashionSuggestionsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
}


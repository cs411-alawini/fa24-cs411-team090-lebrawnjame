'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { UserContext } from '@/contexts/UserContext';

type Messages = {
  Username: string;
  MemberId: number;
  SentBy: number;
  Content: string;
  Time: string;
};

async function getChatGPTResponse(messages: Messages[], selectedMemberName: string) {
  const formattedMessages = messages.map((message) => ({
    role: message.SentBy ? 'assistant' : 'user',
    content: message.Content,
  }));

  const response = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: formattedMessages,
      context: `This is a chat between a user and ${selectedMemberName}. ${selectedMemberName} is a popular K-pop idol part of the global 
      K-pop sensation LE SSERAFIM. She is adored by fans in Korea and throughout the world. She texts in a cute and cheerful way and can 
      speak both English and Korean. She has to respond to each message in 250 characters or less.`,
    }),
  });

  const data = await response.json();
  return data.response;
}

const members = [
  { id: 1, name: 'Sakura', avatar: '/sakura.jpg' },
  { id: 2, name: 'Chaewon', avatar: '/chaewon.jpg' },
  { id: 3, name: 'Yunjin', avatar: '/yunjin.jpg' },
  { id: 4, name: 'Kazuha', avatar: '/kazuha.jpg' },
  { id: 5, name: 'Eunchae', avatar: '/eunchae.jpg' },
];

async function batchPostMessagesToDB(messages: Messages[]) {
  if (messages.length === 0) return;
  try {
    await fetch('/api/storeMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
  } catch (error) { }
}

export default function ChatPage() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [selectedMember, setSelectedMember] = useState(members[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<Record<string, Messages[]>>({
    Sakura: [],
    Chaewon: [],
    Yunjin: [],
    Kazuha: [],
    Eunchae: [],
  });
  const [pendingMessages, setPendingMessages] = useState<Messages[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    } else {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getMessages?username=${encodeURIComponent(username)}`);
        const data: Messages[] = await response.json();
        const organizedHistory: Record<string, Messages[]> = {
          Sakura: [],
          Chaewon: [],
          Yunjin: [],
          Kazuha: [],
          Eunchae: [],
        };

        data.forEach((msg) => {
          const memberName = members.find(member => member.id === msg.MemberId)?.name;
          if (memberName) {
            organizedHistory[memberName].push(msg);
          }
        });

        setChatHistory(organizedHistory);
      } catch (error) { } 
      finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [username]);

  const messages = chatHistory[selectedMember.name];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingMessages.length > 0) {
        batchPostMessagesToDB(pendingMessages);
        setPendingMessages([]);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pendingMessages]);

  const handleContextSwitch = () => {
    if (pendingMessages.length > 0) {
      batchPostMessagesToDB(pendingMessages);
      setPendingMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || !user) return;

    const newMessage: Messages = {
      Username: username,
      MemberId: selectedMember.id,
      SentBy: 0,
      Content: inputMessage,
      Time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    setChatHistory((prevHistory) => ({
      ...prevHistory,
      [selectedMember.name]: [...prevHistory[selectedMember.name], newMessage],
    }));
    setPendingMessages((prevPending) => [...prevPending, newMessage]);

    setInputMessage('');

    const botResponseText = await getChatGPTResponse([...messages, newMessage], selectedMember.name);

    const botMessage: Messages = {
      Username: username, 
      MemberId: selectedMember.id,
      SentBy: 1,
      Content: botResponseText,
      Time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    setChatHistory((prevHistory) => ({
      ...prevHistory,
      [selectedMember.name]: [...prevHistory[selectedMember.name], botMessage],
    }));
    setPendingMessages((prevPending) => [...prevPending, botMessage]);
  };

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 animate-gradient-x" />
        
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute top-1/4 -right-8 w-32 h-32 bg-pink-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
        </div>

        <Card className="w-[400px] relative backdrop-blur-sm bg-white/95 border-2 border-white/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-2">
            <div className="flex justify-center mb-2">
              <MessageSquare className="h-10 w-10 text-pink-500" />
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to LePhoning Chat
            </CardTitle>
            <CardDescription className="text-base">
              Connect with LE SSERAFIM members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-pink-50 border border-pink-100">
              <p className="text-center text-pink-900">
                You must be logged in to chat with LE SSERAFIM members on LePhoning
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/auth?mode=login" className="block">
                <Button 
                  className="w-full h-12 text-lg transition-all hover:scale-[1.02] hover:shadow-lg"
                  variant="default"
                >
                  Log in
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth?mode=signup" className="block">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg border-2 transition-all hover:scale-[1.02] hover:shadow-md hover:border-pink-500 hover:text-pink-500"
                >
                  Sign up
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-sm flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Join the FEARNOT community today!
              <Sparkles className="h-4 w-4" />
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-200 p-4">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 mb-6" onClick={handleContextSwitch}>
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h2 className="text-xl font-bold mb-4">LE SSERAFIM Members</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {members.map((member) => (
            <Button
              key={member.name}
              variant={selectedMember.name === member.name ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => { setSelectedMember(member); handleContextSwitch(); }}
            >
              <Avatar className="mr-2">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              {member.name}
            </Button>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-pink-500 text-white p-4">
          <h1 className="text-xl font-bold">Chat with {selectedMember.name}</h1>
        </div>
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <p>Loading chat history...</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.Time}-${index}`} 
                className={`flex ${
                  message.SentBy ? 'justify-start' : 'justify-end'
                } mb-4`}
              >
                <div
                  className={`max-w-xl p-3 rounded-lg shadow ${
                    message.SentBy
                      ? 'bg-gray-300 text-black'
                      : 'bg-blue-500 text-white'
                  } text-left`}
                >
                  {message.Content}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 mr-2 w-[150%] pr-2"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );  
}
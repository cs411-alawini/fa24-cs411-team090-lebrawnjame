'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
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
  } catch (error) {
    console.error("Error posting batch messages to DB:", error);
  }
}

export default function ChatPage() {
  const { user } = useContext(UserContext);
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
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getMessages?username=${encodeURIComponent(user.username)}`);
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
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

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
      Username: user.username,
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
      Username: user.username, 
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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-200 p-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleContextSwitch}>
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
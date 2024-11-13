'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from 'lucide-react'

const members = [
  { name: 'Kazuha', avatar: '/kazuha.jpg' },
  { name: 'Chaewon', avatar: '/chaewon.jpg' },
  { name: 'Eunchae', avatar: '/eunchae.jpg' },
  { name: 'Yunjin', avatar: '/yunjin.jpg' },
  { name: 'Sakura', avatar: '/sakura.jpg' },
]

type Message = {
  id: number;
  text: string;
  sender: string;
}

export default function ChatPage() {
  const [selectedMember, setSelectedMember] = useState(members[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    }

    setMessages([...messages, newMessage])
    setInputMessage('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: `Hi, this is ${selectedMember.name}! Thanks for your message.`,
        sender: selectedMember.name
      }
      setMessages(prevMessages => [...prevMessages, botMessage])
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">LE SSERAFIM Members</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {members.map((member) => (
            <Button
              key={member.name}
              variant={selectedMember.name === member.name ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setSelectedMember(member)}
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 bg-white">
          <div className="flex">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
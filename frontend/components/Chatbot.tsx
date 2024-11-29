"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserContext } from "@/contexts/UserContext";
import schema from "@/contexts/databaseSchema";

interface Message {
  text: string
  sender: "user" | "bot"
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [pendingMutativeQuery, setPendingMutativeQuery] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState('');

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


  const togglePopup = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSendMessage = async () => {
    if (!username) return

    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setInputValue("");
  
      if (userMessage.toLowerCase() === "yes" && pendingMutativeQuery) {
        const queryResults = await getRequest(pendingMutativeQuery);
        if (queryResults) {
          const summary = "Your requested action was successfully executed. Is there anything else I can help you with?"
          setMessages((prev) => [
            ...prev,
            { text: summary, sender: "bot" },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { text: "The query could not be executed.", sender: "bot" },
          ]);
        }
        setPendingMutativeQuery(null);
        return;
      } else if (userMessage.toLowerCase() === "no" && pendingMutativeQuery) {
        setMessages((prev) => [
          ...prev,
          { text: "The query has been cancelled.", sender: "bot" },
        ]);
        setPendingMutativeQuery(null);
        return;
      }

      const matchedQuery = await matchQuery(userMessage);
  
      if (matchedQuery) {
        const queryResults = await getRequest(matchedQuery);
        if (queryResults) {
          const summary = await summarizeResults(queryResults);
          setMessages((prev) => [
            ...prev,
            { text: summary, sender: "bot" },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { text: "I couldn't retrieve any results for that query.", sender: "bot" },
          ]);
        }
      }
    }
  };  

  const matchQuery = async (userMessage: string) => {
    const context = `
      You are a chatbot that is servicing users on a web application. Here is the database schema:
      ${schema}
  
      The user's username is ${username}. If the user is just chatting casually, simply return a message reciprocating in a helpful manner.

      Otherwise, based on the user's input, try to formulate an appropriate SQL query.
      If a query can be formulated, return only the query in its exact format and nothing else. If a query cannot be formulated, just 
      return an explanation saying that you are unable to fulfill the user request. Don't reveal any information about the database 
      in your explanation, just talk at a very high level.
      
      Queries cannot be formulated when one of two things happen:
  
      1. The user has not provided enough information based on the schema
      2. The user is trying to access data about other users or other private data that should not be exposed to the user.
    `;
  
    try {
      const response = await fetch('/api/matchQuery', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage, context }),
      });
  
      const data = await response.json();
  
      if (data.matchedQuery) {
        const matchedQuery = data.matchedQuery.trim();
  
        if (matchedQuery.toLowerCase().startsWith("select")) {
          return matchedQuery;
        } else if (
          matchedQuery.toLowerCase().startsWith("insert") ||
          matchedQuery.toLowerCase().startsWith("update") ||
          matchedQuery.toLowerCase().startsWith("delete")
        ) {
          setPendingMutativeQuery(matchedQuery);
          setMessages((prev) => [
            ...prev,
            {
              text: `Your requested action will modify the database. Would you like to proceed? Please type "yes" to confirm or "no" to cancel.`,
              sender: "bot",
            },
          ]);
          return null;
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: "I detected a query that doesn't seem valid or is unexpected. Could you clarify your request?",
              sender: "bot",
            },
          ]);
          return null;
        }
      } else if (data.message) {
        setMessages((prev) => [
          ...prev,
          { text: data.message, sender: "bot" },
        ]);
        return null;
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "I couldn't understand your request. Could you clarify?", sender: "bot" },
        ]);
        return null;
      }
    } catch (error) {
      console.error("Error matching query:", error);
      return null;
    }
  };  

  const getRequest = async (query: string) => {
    try {
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error executing query:", error);
        return null;
    }
  };
  
  const summarizeResults = async (queryResults: any) => {
    const context = `You are a chatbot assisting a user. The message history is ${messages}. The user's last message is ${inputValue.trim()} and their username is ${username}. 
    Summarize the following results in a user-friendly way based on the user's message. Ask them if you can help them with anything else.`
    try {
      const response = await fetch('/api/summarizeResults', {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryResults, context }),
      })
      const data = await response.json()
      return data.summary
    } catch (error) {
      return "I couldn't summarize the results."
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={togglePopup}
          className="bg-pink-500 text-white hover:bg-pink-600 rounded-full p-3 shadow-md"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
  
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-pink-500 text-white">
            <h3 className="text-lg font-bold">
              {username ? "Ask me anything!" : "Chatbot"}
            </h3>
            <Button
              onClick={togglePopup}
              variant="ghost"
              className="text-white hover:bg-pink-600 p-1"
            >
              ✕
            </Button>
          </div>
  
          <div
            className="flex-1 px-4 py-2 overflow-y-auto space-y-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                {username
                  ? "Start a conversation!"
                  : "Log in or sign up to access this feature!"}
              </p>
            ) : (
              <ul className="space-y-2">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-md shadow-sm text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>
            )}
          </div>
  
          <div className="px-4 py-2 border-t bg-white">
            <form
              className="flex items-center space-x-2"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 ${
                  !username ? "opacity-50" : ""
                }`}
                onKeyDown={username ? handleKeyDown : undefined}
                readOnly={!username}
              />
              <Button
                type="submit"
                className={`bg-pink-500 text-white hover:bg-pink-600 ${
                  !username ? "opacity-50" : ""
                }`}
                disabled={!username}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )  
}
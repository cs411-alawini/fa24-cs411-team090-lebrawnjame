"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  text: string
  sender: "user" | "bot"
}

const queries = [
  'SELECT * FROM User where Username = "abhi5"',
  // "SELECT * FROM products WHERE price < 100;",
  // "SELECT * FROM orders WHERE status = 'pending';",
  // Add more queries as needed
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const togglePopup = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim()
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }])
      setInputValue("")

      // Step 1: Match the user message with one of the predefined queries
      const matchedQuery = await matchQuery(userMessage)

      if (matchedQuery) {
        // Step 2: Execute the matched query
        const queryResults = await getRequest(matchedQuery)

        if (queryResults) {
          // Step 3: Summarize the results using ChatGPT
          const summary = await summarizeResults(queryResults)
          setMessages((prev) => [
            ...prev,
            { text: summary, sender: "bot" }
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            { text: "I couldn't retrieve any results for that query.", sender: "bot" }
          ])
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "I'm not sure how to answer that. Please try rephrasing.", sender: "bot" }
        ])
      }
    }
  }

  // Function to match user message with the best query using ChatGPT
  const matchQuery = async (userMessage: string) => {
    const context = "Match the user's question with one of the provided database queries. Return the query in the exact format and nothing else.";
    
    try {
      const response = await fetch('/api/matchQuery', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage, queries, context }),
      });
  
      const data = await response.json();
  
      // Check if matchedQuery is in the queries array
      if (queries.includes(data.matchedQuery)) {
        alert(data.matchedQuery);
        return data.matchedQuery;
      } else {
        return null; // Return null if it's not in the array
      }
    } catch (error) {
      alert("Error matching query");
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
        alert("Error executing query");
        return null;
    }
  };
  
  const summarizeResults = async (queryResults: any) => {
    const context = "Summarize the following database query results in a user-friendly way."
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
      alert("Error summarizing results")
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
            <h3 className="text-lg font-bold">Ask me anything!</h3>
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
              <p className="text-gray-500 text-center">Start a conversation!</p>
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
                className="flex-1"
                onKeyDown={handleKeyDown}
              />
              <Button
                type="submit"
                className="bg-pink-500 text-white hover:bg-pink-600"
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
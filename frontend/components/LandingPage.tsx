'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, Camera, ShoppingBag, Mic, Heart, Zap, Users, Music, Video } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Chatbot from "@/components/Chatbot"
import { UserContext } from "@/contexts/UserContext"; // Import the UserContext
import { useContext } from "react"

export default function LandingPage() {
  const [username, setUsername] = useState<string | null>(null)
  const { user } = useContext(UserContext); // Access user data from context

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center justify-center bg-white">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <Link className="flex items-center justify-center" href="#">
            <Mic className="h-6 w-6 text-pink-500" />
            <span className="ml-2 text-2xl font-bold text-pink-500">LePhoning</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/chat">
              Chat
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/events">
              Events
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/media">
              Media
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/shop">
              Shop
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/livestream">
              Livestream
            </Link>
            {user ? (
              <Link href="/profile">
                <Button variant="ghost" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {user.username} {/* Display the username */}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth?tab=login">
                  <Button variant="ghost" className="text-sm font-medium">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth?tab=signup">
                  <Button className="bg-pink-500 text-white hover:bg-pink-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Welcome to LePhoning
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                  The ultimate hub for LE SSERAFIM fans. Connect, chat, and stay updated with your favorite K-pop group!
                </p>
              </div>
              <div className="space-x-4">
                <Link href="#pages">
                  <Button className="bg-white text-pink-500 hover:bg-gray-100">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-pink-500">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-pink-500">
              Why Choose LePhoning?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <MessageSquare className="w-8 h-8 text-pink-500 mb-2" />
                  <CardTitle>AI-Powered Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Engage with AI chatbots simulating LE SSERAFIM members for a unique fan experience.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="w-8 h-8 text-pink-500 mb-2" />
                  <CardTitle>Real-time Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Stay on top of the latest news, events, and content from LE SSERAFIM and the fandom.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-8 h-8 text-pink-500 mb-2" />
                  <CardTitle>Community Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Connect with fellow FEARNOT members and build lasting friendships within the fandom.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="pages" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-pink-500">
              Explore LePhoning
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              <Link href="/chat" className="flex flex-col items-center space-y-2 hover:text-pink-500 transition-colors">
                <MessageSquare className="w-12 h-12" />
                <span className="font-medium">Chat</span>
              </Link>
              <Link href="/events" className="flex flex-col items-center space-y-2 hover:text-pink-500 transition-colors">
                <Calendar className="w-12 h-12" />
                <span className="font-medium">Events</span>
              </Link>
              <Link href="/media" className="flex flex-col items-center space-y-2 hover:text-pink-500 transition-colors">
                <Camera className="w-12 h-12" />
                <span className="font-medium">Media</span>
              </Link>
              <Link href="/shop" className="flex flex-col items-center space-y-2 hover:text-pink-500 transition-colors">
                <ShoppingBag className="w-12 h-12" />
                <span className="font-medium">Shop</span>
              </Link>
              <Link href="/livestream" className="flex flex-col items-center space-y-2 hover:text-pink-500 transition-colors">
                <Video className="w-12 h-12" />
                <span className="font-medium">Livestream</span>
              </Link>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-pink-500 to-purple-500">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Join the FEARNOT Family Today!
                </h2>
                <p className="mx-auto max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up now to get exclusive access to LE SSERAFIM content and connect with fans worldwide.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-white" placeholder="Enter your email" type="email" />
                  <Button className="bg-white text-pink-500 hover:bg-gray-100">Sign Up</Button>
                </form>
                <p className="text-xs text-white">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 px-4 md:px-6 border-t bg-white">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© 2024 LePhoning. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="https://docs.google.com/document/d/1UKMjTSykd-DO5ivyFYOz3wIXTXZA60mDX_XeK5_7eTc/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="https://docs.google.com/document/d/1AFcgWn3-zFVwZs6lcrbl98ondCBi0-dSpaZmQbXKu48/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
      <Chatbot />
    </div>
  )
}
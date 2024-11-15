'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const LiveStreamPage = () => {
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (isLive) {
      const chatangoScript = document.createElement("script")
      chatangoScript.id = "cid0020000392664811261"
      chatangoScript.src = "//st.chatango.com/js/gz/emb.js"
      chatangoScript.async = true
      chatangoScript.dataset.cfasync = "false"
      chatangoScript.style.width = "300px";
      chatangoScript.style.height = "500px";
      chatangoScript.innerHTML = JSON.stringify({
        handle: "westreaming",
        arch: "js",
        styles: {
          a: "CC0000",
          b: 100,
          c: "FFFFFF",
          d: "FFFFFF",
          k: "CC0000",
          l: "CC0000",
          m: "CC0000",
          n: "FFFFFF",
          p: 10,
          q: "CC0000",
          r: 100,
          fwtickm: 1,
        },
      })
      document.getElementById("chat-container")?.appendChild(chatangoScript)

      return () => {
        document.getElementById("chat-container")?.removeChild(chatangoScript)
      }
    }
  }, [isLive])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center text-pink-500">LE SSERAFIM Live Stream</h1>
          <Button
            onClick={() => setIsLive(!isLive)}
            variant={isLive ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            {isLive ? "End Stream" : "Go Live"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Live Stream</CardTitle>
            </CardHeader>
            <CardContent className="aspect-video bg-black rounded-lg overflow-hidden">
              {isLive ? (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/UBol6eDEr2k?autoplay=1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Live Stream"
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <p className="text-lg">Click "Go Live" to start streaming</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-16rem)]">
              <div id="chat-container" className="w-full h-full min-w-[300px] min-h-[500px]"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LiveStreamPage
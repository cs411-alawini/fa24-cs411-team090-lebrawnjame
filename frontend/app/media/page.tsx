'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, Video } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'

import Link from 'next/link'

//asked gpt to generate fake data (we need to work with endpoints for this)
const mediaItems = [
  { id: 1, type: 'image', src: '/placeholder.svg?height=300&width=300', alt: 'LE SSERAFIM group photo' },
  { id: 2, type: 'video', src: '/placeholder.svg?height=300&width=300', alt: 'LE SSERAFIM performance video' },
  { id: 3, type: 'image', src: '/placeholder.svg?height=300&width=300', alt: 'Kazuha solo shot' },
  { id: 4, type: 'image', src: '/placeholder.svg?height=300&width=300', alt: 'Chaewon solo shot' },
  { id: 5, type: 'video', src: '/placeholder.svg?height=300&width=300', alt: 'LE SSERAFIM behind the scenes' },
  { id: 6, type: 'image', src: '/placeholder.svg?height=300&width=300', alt: 'Eunchae solo shot' },
  { id: 7, type: 'image', src: '/placeholder.svg?height=300&width=300', alt: 'Yunjin solo shot' },
  { id: 8, type: 'video', src: '/placeholder.svg?height=300&width=300', alt: 'LE SSERAFIM music video teaser' },
  { id: 9, type: 'image', src: '/placeholder.svg?height=300&width=300', alt: 'Sakura solo shot' },
]

export default function MediaPage() {
  const [filter, setFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<{ id: number; type: string; src: string; alt: string; } | null>(null)

  const filteredItems = mediaItems.filter(item => 
    filter === 'all' || item.type === filter
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-500">LE SSERAFIM Media</h1>
      
      <Tabs defaultValue="all" className="w-full max-w-3xl mx-auto mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
          <TabsTrigger value="image" onClick={() => setFilter('image')}>
            <Camera className="mr-2 h-4 w-4" />
            Photos
          </TabsTrigger>
          <TabsTrigger value="video" onClick={() => setFilter('video')}>
            <Video className="mr-2 h-4 w-4" />
            Videos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 w-full h-full aspect-square overflow-hidden rounded-lg"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Video className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  {selectedItem && (
                    selectedItem.type === 'image' ? (
                      <Image
                        src={selectedItem.src}
                        alt={selectedItem.alt}
                        width={800}
                        height={600}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <Video className="h-24 w-24 text-gray-400" />
                        <p className="text-gray-500 mt-4">Video playback not implemented</p>
                      </div>
                    )
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
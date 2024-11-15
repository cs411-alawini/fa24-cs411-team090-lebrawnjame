'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, Video, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type MediaItem = {
  id: number;
  type: 'image' | 'video';
  src: string;
  alt: string;
}

export default function MediaPage() {
  const [filter, setFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  useEffect(() => {
    async function loadMediaItems() {
      try {
        const items: MediaItem[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          type: ['image11.webp', 'image14.webp'].includes(`image${i + 1}.webp`) ? 'video' : 'image',
          src: `/media/image${i + 1}.${['image11.webp', 'image14.webp'].includes(`image${i + 1}.webp`) ? 'webp' : 
                 i + 1 === 7 ? 'jpeg' : 
                 i + 1 === 13 ? 'png' : 'jpg'}`,
          alt: `LE SSERAFIM ${['image11.webp', 'image14.webp'].includes(`image${i + 1}.webp`) ? 'video' : 'photo'} ${i + 1}`,
        }))
        setMediaItems(items)
      } catch (error) {
        console.error('Error loading media items:', error)
      }
    }

    loadMediaItems()
  }, [])

  const filteredItems = mediaItems.filter(item => 
    filter === 'all' || item.type === filter
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2 mb-4">
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
                      <video controls className="w-full h-auto">
                        <source src={selectedItem.src} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
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
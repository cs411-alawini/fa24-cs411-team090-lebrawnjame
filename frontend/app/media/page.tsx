'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type MediaItem = {
  id: number;
  type: 'image';
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
        const items: MediaItem[] = Array.from({ length: 56 }, (_, i) => ({
          id: i + 1,
          type: 'image',
          src: `/media/image${i + 1}.${i + 1 === 7 ? 'jpeg' : i + 1 === 13 ? 'png' : 'jpg'}`,
          alt: `LE SSERAFIM photo ${i + 1}`,
        }))
        setMediaItems(items)
      } catch (error) {
        console.error('Error loading media items:', error)
      }
    }

    loadMediaItems()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-500">LE SSERAFIM Media</h1>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
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
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  {selectedItem && (
                    <Image
                      src={selectedItem.src}
                      alt={selectedItem.alt}
                      width={800}
                      height={600}
                      className="object-contain w-full h-full"
                    />
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
// 'use client'
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Camera, ArrowLeft } from 'lucide-react';
// import Link from 'next/link';

// type MediaItem = {
//   id: number;
//   type: 'image' | 'video';
//   src: string;
//   alt: string;
// };

// export default function MediaPage() {
//   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
//   const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

//   useEffect(() => {
//     async function fetchMediaItems() {
//       try {
//         const response = await fetch('/api/getMedia');
//         const data = await response.json();
//         setMediaItems(data);
//       } catch (error) {
//         console.error('Error fetching media items:', error);
//       }
//     }

//     fetchMediaItems();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <Link href="/">
//         <Button variant="outline" className="flex items-center gap-2 mb-4">
//           <ArrowLeft className="h-4 w-4" />
//           Back to Home
//         </Button>
//       </Link>
//       <h1 className="text-3xl font-bold text-center mb-8 text-pink-500">LE SSERAFIM Media</h1>
      
//       <ScrollArea className="h-[calc(100vh-200px)]">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {mediaItems.map((item) => (
//             <div key={item.id}>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     className="p-0 w-full h-full aspect-square overflow-hidden rounded-lg"
//                     onClick={() => setSelectedItem(item)}
//                   >
//                     <Image
//                       src={item.src}
//                       alt={item.alt}
//                       width={300}
//                       height={300}
//                       className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
//                     />
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-3xl">
//                   {selectedItem && (
//                     <Image
//                       src={selectedItem.src}
//                       alt={selectedItem.alt}
//                       width={800}
//                       height={600}
//                       className="object-contain w-full h-full"
//                     />
//                   )}
//                 </DialogContent>
//               </Dialog>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock product data
const products = [
  {
    id: 1,
    name: "4th Mini Album 'CRAZY' THUNDERING CEDAR",
    price: 32.00,
    image: "/placeholder.svg?height=400&width=400",
    status: [],
  },
  {
    id: 2,
    name: "4th Mini Album 'CRAZY' HEATHERS ROCK",
    price: 32.00,
    image: "/placeholder.svg?height=400&width=400",
    status: [],
  },
  {
    id: 3,
    name: "4th Mini Album 'CRAZY' ODD FAIRY FLOSS",
    price: 32.00,
    image: "/placeholder.svg?height=400&width=400",
    status: [],
  },
  {
    id: 4,
    name: "4th Mini Album 'CRAZY' (COMPACT ver.)",
    price: 19.00,
    image: "/placeholder.svg?height=400&width=400",
    status: [],
  },
  {
    id: 5,
    name: "4th Mini Album 'CRAZY' THUNDERING CEDAR (Signed ver.)",
    price: 32.00,
    image: "/placeholder.svg?height=400&width=400",
    status: ["Sold out", "Signed"],
  },
  {
    id: 6,
    name: "4th Mini Album 'CRAZY' HEATHERS ROCK (Signed ver.)",
    price: 32.00,
    image: "/placeholder.svg?height=400&width=400",
    status: ["Sold out", "Signed"],
  },
]

export default function ShopPage() {
  const [sortBy, setSortBy] = useState('featured')

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
          <h1 className="text-3xl font-bold text-center text-pink-500">LE SSERAFIM Shop</h1>
          <div className="w-[150px]">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.status.map((status, index) => (
                    <Badge
                      key={index}
                      variant={status === "Sold out" ? "destructive" : "secondary"}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h2>
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  disabled={product.status.includes("Sold out")}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.status.includes("Sold out") ? "Sold Out" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
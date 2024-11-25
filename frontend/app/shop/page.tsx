'use client'

import { useState, useEffect } from 'react'
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

interface MerchItem {
  MerchType: string;
  Merchant: string;
  Link: string;
  id: number;
  price: number;
  image: string;
  status: string[];
}

export default function ShopPage() {
  const [sortBy, setSortBy] = useState('featured')
  const [cart, setCart] = useState<MerchItem[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return [];
  });
  const [merchandise, setMerchandise] = useState<MerchItem[]>([]);

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const response = await fetch('/api/getMerchandise');
        if (!response.ok) {
          throw new Error('Failed to fetch merchandise');
        }
        const data = await response.json();
        
        // Transform the data to match the MerchItem interface
        const transformedData: MerchItem[] = data.map((item: any) => {
          const imageName = item.MerchType.toLowerCase().replace(/\s+/g, '-');
          return {
            ...item,
            price: Math.floor(Math.random() * (50 - 10 + 1) + 10), // Random price between 10 and 50
            image: `/shop/${imageName}.png`,
            status: Math.random() > 0.8 ? ['Sold out'] : [], // 20% chance of being sold out
          };
        });

        setMerchandise(transformedData);
      } catch (error) {
        console.error('Error fetching merchandise:', error);
      }
    };

    fetchMerchandise();
  }, []);

  const addToCart = (product: MerchItem) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const sortedMerchandise = [...merchandise].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-8">
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
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-600">{merchandise.length} items</p>
          <Link href="/checkout">
            <Button variant="outline" className="bg-pink-500 text-white hover:bg-pink-600 transition-colors">
              Checkout ({cart.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedMerchandise.map((product) => (
            <Card key={product.id} className="overflow-hidden group bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.MerchType}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => {
                      const imgElement = document.getElementById(`product-image-${product.id}`) as HTMLImageElement;
                      if (imgElement) {
                        imgElement.src = '/placeholder.png';
                      }
                    }}
                    id={`product-image-${product.id}`}
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
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">{product.MerchType}</h2>
                <p className="text-sm text-gray-600 mb-2">{product.Merchant}</p>
                <p className="text-lg font-bold text-pink-500">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                  disabled={product.status.includes("Sold out")}
                  onClick={() => addToCart(product)}
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


// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { ArrowLeft, ShoppingCart } from 'lucide-react'
// import Link from 'next/link'
// import Image from 'next/image'

// interface MerchItem {
//   MerchType: string;
//   Merchant: string;
//   Link: string;
//   id: number;
//   price: number;
//   image: string;
//   status: string[];
// }

// export default function ShopPage() {
//   const [sortBy, setSortBy] = useState('featured')
//   const [cart, setCart] = useState<MerchItem[]>(() => {
//     if (typeof window !== 'undefined') {
//       return JSON.parse(localStorage.getItem('cart') || '[]');
//     }
//     return [];
//   });
//   const [merchandise, setMerchandise] = useState<MerchItem[]>([]);

//   useEffect(() => {
//     const fetchMerchandise = async () => {
//       try {
//         const response = await fetch('/api/getMerchandise');
//         if (!response.ok) {
//           throw new Error('Failed to fetch merchandise');
//         }
//         const data = await response.json();
        
//         // Transform the data to match the MerchItem interface
//         const transformedData: MerchItem[] = data.map((item: any) => {
//           const imageName = item.MerchType.toLowerCase().replace(/\s+/g, '-');
//           return {
//             ...item,
//             price: Math.floor(Math.random() * (50 - 10 + 1) + 10), // Random price between 10 and 50
//             image: `/shop/${imageName}.png`,
//             status: Math.random() > 0.8 ? ['Sold out'] : [], // 20% chance of being sold out
//           };
//         });

//         setMerchandise(transformedData);
//       } catch (error) {
//         console.error('Error fetching merchandise:', error);
//       }
//     };

//     fetchMerchandise();
//   }, []);

//   const addToCart = (product: MerchItem) => {
//     const updatedCart = [...cart, product];
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const sortedMerchandise = [...merchandise].sort((a, b) => {
//     switch (sortBy) {
//       case 'price-asc':
//         return a.price - b.price;
//       case 'price-desc':
//         return b.price - a.price;
//       case 'newest':
//         return b.id - a.id;
//       default:
//         return 0;
//     }
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <Link href="/">
//             <Button variant="outline" className="flex items-center gap-2">
//               <ArrowLeft className="h-4 w-4" />
//               Back to Home
//             </Button>
//           </Link>
//           <h1 className="text-3xl font-bold text-center text-pink-500">LE SSERAFIM Shop</h1>
//           <div className="w-[150px]">
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="featured">Featured</SelectItem>
//                 <SelectItem value="price-asc">Price: Low to High</SelectItem>
//                 <SelectItem value="price-desc">Price: High to Low</SelectItem>
//                 <SelectItem value="newest">Newest</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
        
//         <div className="flex justify-between items-center mb-8">
//           <p className="text-sm text-gray-600">{merchandise.length} items</p>
//           <Link href="/checkout">
//             <Button variant="outline" className="bg-pink-500 text-white hover:bg-pink-600 transition-colors">
//               Checkout ({cart.length})
//             </Button>
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {sortedMerchandise.map((product) => (
//             <Card key={product.id} className="overflow-hidden group bg-white shadow-lg hover:shadow-xl transition-shadow">
//               <CardHeader className="p-0">
//                 <div className="aspect-square relative overflow-hidden bg-gray-200">
//                   <Image
//                     src={product.image}
//                     alt={product.MerchType}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-110"
//                     onError={() => {
//                       const imgElement = document.getElementById(`product-image-${product.id}`) as HTMLImageElement;
//                       if (imgElement) {
//                         imgElement.src = '/placeholder.png';
//                       }
//                     }}
//                     id={`product-image-${product.id}`}
//                   />
//                 </div>
//               </CardHeader>
//               <CardContent className="p-4">
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {product.status.map((status, index) => (
//                     <Badge
//                       key={index}
//                       variant={status === "Sold out" ? "destructive" : "secondary"}
//                     >
//                       {status}
//                     </Badge>
//                   ))}
//                 </div>
//                 <h2 className="font-semibold text-lg mb-2 line-clamp-2">{product.MerchType}</h2>
//                 <p className="text-sm text-gray-600 mb-2">{product.Merchant}</p>
//                 <p className="text-lg font-bold text-pink-500">${product.price.toFixed(2)}</p>
//               </CardContent>
//               <CardFooter className="p-4 pt-0">
//                 <Button
//                   className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
//                   disabled={product.status.includes("Sold out")}
//                   onClick={() => addToCart(product)}
//                 >
//                   <ShoppingCart className="mr-2 h-4 w-4" />
//                   {product.status.includes("Sold out") ? "Sold Out" : "Add to Cart"}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import React, { memo } from 'react';

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

const CACHE_KEY = 'merchandiseCache';
const CACHE_DURATION = 1000 * 60 * 5;

export default function ShopPage() {
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState<MerchItem[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return [];
  });
  const [merchandise, setMerchandise] = useState<MerchItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const now = Date.now();

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (now - timestamp < CACHE_DURATION) {
            setMerchandise(data);
            return;
          }
        }

        const response = await fetch('/api/getMerchandise');
        if (!response.ok) {
          throw new Error('Failed to fetch merchandise');
        }
        const data = await response.json();

        const transformedData: MerchItem[] = data.map((item: any) => {
          const imageName = item.MerchType.toLowerCase().replace(/\s+/g, '-');
          return {
            ...item,
            id: item.ItemID,
            price: Math.floor(Math.random() * (50 - 10 + 1) + 10),
            image: `/shop/${imageName}.png`,
            status: Math.random() > 0.8 ? ['Sold out'] : [],
          };
        });

        setMerchandise(transformedData);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: transformedData, timestamp: now })
        );
      } catch (error) {
        console.error('Error fetching merchandise:', error);
      }
    };

    fetchMerchandise();
  }, []);

  const addToCart = (product: MerchItem, quantity: number) => {
    const updatedCart = [...cart, ...Array(quantity).fill(product)];
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

  const ProductCard = memo(({ product, addToCart, cart }: { 
    product: MerchItem; 
    addToCart: (product: MerchItem, quantity: number) => void; 
    cart: MerchItem[];
  }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const currentQuantity = cart.filter((item) => item.id === product.id).length;
    const maxAddable = Math.max(0, 10 - currentQuantity);
  
    return (
      <Card key={product.id} className="overflow-hidden group bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-0">
          <div className="aspect-square relative overflow-hidden bg-gray-200">
            <Image
              src={product.image}
              alt={product.MerchType}
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
          <h2 className="font-semibold text-lg mb-2 line-clamp-2">{product.MerchType}</h2>
          <p className="text-sm text-gray-600 mb-2">{product.Merchant}</p>
          <p className="text-lg font-bold text-pink-500">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center gap-4">
          <Select
            value={selectedQuantity.toString()}
            onValueChange={(value) => setSelectedQuantity(parseInt(value, 10))}
            disabled={maxAddable === 0}
          >
            <SelectTrigger className={`w-16 ${maxAddable === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={maxAddable === 0}>
              <SelectValue placeholder="Qty" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(maxAddable).keys()].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          <Button
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            disabled={product.status.includes("Sold out") || currentQuantity >= 10}
            onClick={() => addToCart(product, selectedQuantity)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {currentQuantity >= 10 ? "Max Reached" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    );
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
          <div className="w-[160px]">
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
            <ProductCard key={product.id} product={product} addToCart={addToCart} cart={cart} />
          ))}
        </div>
      </div>
    </div>
  );  
}

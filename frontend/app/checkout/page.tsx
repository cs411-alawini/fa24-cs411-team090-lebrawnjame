'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  status: string[];
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(storedCart);
    }
  }, []);

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-500 mb-8">Checkout</h1>
        <Link href="/shop">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
        </Link>
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-lg text-gray-700">${item.price.toFixed(2)}</p>
                <Button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
                >
                  Remove from Cart
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, ShoppingCart, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import Image from 'next/image';
import { sendOrderConfirmation } from '@/app/api/actions/sendOrderConfirmation';
import { useToast } from "@/components/ui/use-toast";

type Product = {
  id: number;
  MerchType: string;
  price: number;
  image: string;
  status: string[];
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(storedCart);
    }
  }, []);

  const getUniqueCartItems = () => {
    const itemMap = new Map<number, { item: Product; quantity: number }>();

    cart.forEach((item) => {
      if (itemMap.has(item.id)) {
        itemMap.get(item.id)!.quantity += 1;
      } else {
        itemMap.set(item.id, { item, quantity: 1 });
      }
    });

    return Array.from(itemMap.values());
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const newCart = cart.filter((item) => item.id !== productId);
    const updatedItems = Array(quantity).fill(cart.find((item) => item.id === productId)!);

    setCart([...newCart, ...updatedItems]);
    localStorage.setItem('cart', JSON.stringify([...newCart, ...updatedItems]));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return getUniqueCartItems().reduce(
      (total, { item, quantity }) => total + item.price * quantity,
      0
    );
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const total = calculateTotal();
    const result = await sendOrderConfirmation(email, total);
    setIsProcessing(false);

    if (result.success) {
      toast({
        title: "Order Confirmation Sent",
        description: "Check your email for order details.",
        duration: 5000,
      });

      setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to process order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/shop">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your items before checkout</CardDescription>
              </div>

              <div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setCart([]);
                    localStorage.setItem('cart', JSON.stringify([]));
                  }}
                >
                  Clear Cart
                </Button>
              </div>
            </CardHeader>

            <CardContent
              className="flex-1 overflow-y-auto space-y-4"
              style={{
                maxHeight: '400px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style jsx>{`
                ::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {cart.length > 0 ? (
                getUniqueCartItems().map(({ item, quantity }) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.MerchType}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.MerchType}</h3>
                      <p className="text-gray-700">${(item.price * quantity).toFixed(2)}</p>
                    </div>

                    <Select
                      value={quantity.toString()}
                      onValueChange={(value) =>
                        updateQuantity(item.id, parseInt(value, 10))
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Qty" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10).keys()].map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              )}
            </CardContent>

            <Separator className="my-4" />
            <CardFooter className="mt-auto justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">${calculateTotal().toFixed(2)}</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>Complete your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter your address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Card Information</Label>
                <div className="relative">
                  <Input id="card" placeholder="1234 5678 9012 3456" />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM / YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-pink-500 hover:bg-pink-600 text-white" 
                disabled={cart.length === 0 || isProcessing} 
                onClick={handlePayment}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isProcessing ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
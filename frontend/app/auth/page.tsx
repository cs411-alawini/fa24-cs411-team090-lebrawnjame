'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext'

export default function AuthPage() {
  const { login } = useContext(UserContext);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ username: '', email: '', password: '' })

  const validateForm = () => {
    let isValid = true
    const newErrors = { username: '', email: '', password: '' }

    if (!isLogin && username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long'
      isValid = false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isLogin ? 'http://localhost:3001/auth/login' : 'http://localhost:3001/auth/signup';
    const payload = isLogin
      ? { email, password }
      : { username, email, password, membershipStatus: 0, location: 1 };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        login({ username: data.username, email: data.email, token: data.token }); // Store user globally
        router.push('/');
      } else {
        setErrors((prev) => ({ ...prev, form: data.message || 'Authentication failed' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: 'Server error' }));
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to LePhoning</CardTitle>
            <CardDescription className="text-center">Connect with LE SSERAFIM fans worldwide</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
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
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Choose a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              By signing up, you agree to our{' '}
              <a
                href="https://docs.google.com/document/d/1UKMjTSykd-DO5ivyFYOz3wIXTXZA60mDX_XeK5_7eTc/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="https://docs.google.com/document/d/1AFcgWn3-zFVwZs6lcrbl98ondCBi0-dSpaZmQbXKu48/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Privacy Policy
              </a>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
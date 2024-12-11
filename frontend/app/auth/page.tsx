'use client'

import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Sparkles, UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'
import { UserContext } from '@/contexts/UserContext'

export default function AuthPage() {
  const { login } = useContext(UserContext);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username: string; email?: string; password: string, form?: string }>({ username: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors: { username: string; email?: string; password: string } = { username: '', password: '' };

    if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    }
    if (!isLogin && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isLogin ? 'http://localhost:3001/auth/login' : 'http://localhost:3001/auth/signup';
    const payload = isLogin
      ? { username, password }
      : { username, email, password, membershipStatus: 0, location: 1 };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        login({ username: username, email: email, token: data.token });
        router.push('/');
      } else {
        setErrors((prev) => ({ ...prev, form: data.message || 'Authentication failed' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: 'Incorrect password' }));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 animate-gradient-x" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/4 -right-8 w-32 h-32 bg-pink-400/20 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
      </div>

      <Link href="/" className="absolute top-4 left-4 z-10">
        <Button variant="outline" className="flex items-center gap-2 bg-white/80 hover:bg-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/95 border-2 border-white/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to LePhoning
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Connect with LE SSERAFIM fans worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="text-lg">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 transition-all"
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 transition-all"
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}
                <Button type="submit" className="w-full h-12 text-lg transition-all hover:scale-[1.02] hover:shadow-lg">
                  Login
                </Button>
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
                    className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 transition-all"
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
                    className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 transition-all"
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
                    className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 transition-all"
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}
                <Button type="submit" className="w-full h-12 text-lg transition-all hover:scale-[1.02] hover:shadow-lg">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            By signing up, you agree to our{' '}
            <a
              href="https://docs.google.com/document/d/1UKMjTSykd-DO5ivyFYOz3wIXTXZA60mDX_XeK5_7eTc/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 underline transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://docs.google.com/document/d/1AFcgWn3-zFVwZs6lcrbl98ondCBi0-dSpaZmQbXKu48/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 underline transition-colors"
            >
              Privacy Policy
            </a>.
            <Sparkles className="h-4 w-4 text-pink-500" />
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}


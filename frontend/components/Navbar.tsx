'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (storedUsername && isLoggedIn) {
      setUsername(storedUsername)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    setUsername(null)
    window.location.href = '/'
  }

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center bg-white shadow-sm">
      <Link href="/">
        <span className="text-xl font-bold text-pink-500">LePhoning</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {username ? (
          <>
            <span className="text-gray-600">Welcome, {username}!</span>
            <Link href="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost">Logout</Button>
          </>
        ) : (
          <Link href="/auth">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
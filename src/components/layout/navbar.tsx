'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Your Blog'}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/posts" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Posts
            </Link>
            {session?.user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
            {(session?.user?.role === 'admin' || session?.user?.role === 'author') && (
              <Link 
                href="/admin/posts" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Write
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'Profile'}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-muted-foreground">
                  {session.user?.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => signIn('google')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 
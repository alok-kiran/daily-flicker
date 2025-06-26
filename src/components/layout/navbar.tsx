'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { 
  Sun, 
  Moon, 
  ShoppingBag, 
  Menu,
  // MapPin,
  // Thermometer
} from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Add your dark mode toggle logic here
    document.documentElement.classList.toggle('dark')
  }

  return (
    <>
      {/* Top Banner */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Daily Flicker News</span>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <span>Cairo 32°C</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs opacity-90">
                Your Source for Daily Updates
              </span>
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-blue-500 hover:bg-blue-400 text-white border-0 text-xs px-3 py-1 h-6"
              >
                SUBSCRIBE NOW
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="text-blue-600">Daily</span>
                <span className="text-gray-900 dark:text-white">Flicker</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="space-x-1">
                  <NavigationMenuItem>
                    <Link href="/" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      HOME
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      WORLD
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <div className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                              <div className="mb-2 mt-4 text-lg font-medium">
                                World News
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Stay updated with global events and breaking news from around the world.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </div>
                        <div className="grid gap-1">
                          <NavigationMenuLink asChild>
                            <Link href="/world/politics" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Politics</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                International political developments
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/world/economy" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Economy</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Global economic trends and markets
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      SPORTS
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                        <NavigationMenuLink asChild>
                          <Link href="/sports/football" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Football</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Latest football news and scores
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/sports/basketball" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Basketball</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              NBA, college basketball updates
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      TECH
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                        <NavigationMenuLink asChild>
                          <Link href="/tech/ai" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Artificial Intelligence</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Latest AI developments and trends
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/tech/gadgets" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Gadgets</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Reviews and latest tech gadgets
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/community" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      COMMUNITY
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/shop" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      SHOP
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      FEATURES
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4">
                        <NavigationMenuLink asChild>
                          <Link href="/features/opinion" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Opinion</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Editorial and opinion pieces
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/features/lifestyle" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Lifestyle</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Health, culture, and lifestyle content
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Shopping Cart */}
              <Button variant="ghost" size="sm" className="p-2">
                <ShoppingBag className="h-4 w-4" />
              </Button>

              {/* Auth Section */}
              {status === 'loading' ? (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              ) : session ? (
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Profile'}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-muted-foreground hidden lg:block">
                    {session.user?.name}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => signOut()}
                    className="hidden lg:flex"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => signIn('google')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-2"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <SheetTitle className="text-left">
                      <span className="text-blue-600">Daily</span>
                      <span className="text-gray-900 dark:text-white">Flicker</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col h-full">
                    {/* Mobile Navigation Links */}
                    <div className="flex-1 p-4 space-y-1">
                      <Link 
                        href="/" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        HOME
                      </Link>
                      <Link 
                        href="/world" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        WORLD
                      </Link>
                      <Link 
                        href="/sports" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        SPORTS
                      </Link>
                      <Link 
                        href="/tech" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        TECH
                      </Link>
                      <Link 
                        href="/community" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        COMMUNITY
                      </Link>
                      <Link 
                        href="/shop" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        SHOP
                      </Link>
                      <Link 
                        href="/features" 
                        className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        FEATURES
                      </Link>
                      
                      {/* Admin Links for Mobile */}
                      {session?.user?.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      {(session?.user?.role === 'admin' || session?.user?.role === 'author') && (
                        <Link 
                          href="/admin/posts" 
                          className="block py-3 px-4 text-gray-900 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Write
                        </Link>
                      )}
                    </div>

                    {/* Mobile Auth & Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                      {session ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {session.user?.image && (
                              <img
                                src={session.user.image}
                                alt={session.user.name || 'Profile'}
                                className="h-10 w-10 rounded-full"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => signOut()}
                            className="w-full"
                          >
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => signIn('google')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Sign In
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>


        </div>
      </nav>
    </>
  )
} 
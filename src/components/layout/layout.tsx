import { Navbar } from './navbar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 {process.env.NEXT_PUBLIC_APP_NAME || 'Your Blog'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
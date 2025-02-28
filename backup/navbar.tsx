"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BrainCircuit } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const isLoggedIn = pathname.includes("/dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-orange-500" />
          <Link href="/" className="text-xl font-bold">
            BrandAI
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/features" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/pricing" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
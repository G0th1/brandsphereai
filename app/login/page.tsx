"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrainCircuit } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <BrainCircuit className="h-10 w-10 text-orange-500" />
            <h1 className="text-2xl font-bold">Välkommen tillbaka till BrandAI</h1>
            <p className="text-muted-foreground text-center">
              Logga in på ditt konto för att hantera ditt personliga varumärke
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="namn@exempel.se"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input 
                  id="password"
                  type="password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                Logga in
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Har du inget konto?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Registrera dig
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
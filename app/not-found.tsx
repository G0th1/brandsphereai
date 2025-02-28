import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Sidan kunde inte hittas</h2>
        <p className="mt-2 text-muted-foreground">
          Tyvärr kunde vi inte hitta sidan du letar efter.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till startsidan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 
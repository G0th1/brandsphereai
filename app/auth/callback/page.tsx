'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        router.push('/login?error=auth')
        return
      }

      // Redirect till dashboard efter lyckad inloggning
      router.push('/dashboard')
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loggar in...</h2>
        <p className="text-muted-foreground">Du kommer att omdirigeras automatiskt.</p>
      </div>
    </div>
  )
} 
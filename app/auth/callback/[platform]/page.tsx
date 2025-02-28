'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { platformService } from '@/services/platform-service'

async function exchangeCodeForTokens(platform: string, code: string, state: string) {
  const response = await fetch(`/api/auth/${platform}/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, state }),
  })

  if (!response.ok) {
    throw new Error('Kunde inte ansluta till plattformen')
  }

  return response.json()
}

type Platform = 'youtube' | 'facebook';

type PageProps = {
  params: {
    platform: Platform
  }
}

export default function PlatformCallbackPage({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    async function handleCallback() {
      try {
        if (error) {
          throw new Error('Anslutningen avbröts')
        }

        if (!code || !state) {
          throw new Error('Ogiltig callback-URL')
        }

        const { accessToken, refreshToken, platformUserId } = await exchangeCodeForTokens(
          params.platform,
          code,
          state
        )

        await platformService.saveConnection({
          platform: params.platform,
          accessToken,
          refreshToken,
          platformUserId,
        })

        toast({
          title: 'Anslutningen lyckades!',
          description: `Ditt ${params.platform}-konto har anslutits.`,
          duration: 5000,
        })

        router.push('/dashboard')
      } catch (error) {
        console.error('Callback error:', error)
        toast({
          variant: 'destructive',
          title: 'Något gick fel',
          description: error instanceof Error ? error.message : 'Kunde inte ansluta till plattformen',
          duration: 5000,
        })
        router.push('/dashboard')
      }
    }

    handleCallback()
  }, [params.platform, router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-4">Ansluter till {params.platform}...</p>
      </div>
    </div>
  )
} 
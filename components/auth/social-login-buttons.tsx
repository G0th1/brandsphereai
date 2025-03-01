'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { 
  Chrome, 
  Facebook,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

const PROVIDERS = [
  {
    name: 'google',
    displayName: 'Google',
    icon: Chrome,
    color: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-900',
    borderColor: 'border border-gray-300',
  },
  {
    name: 'facebook',
    displayName: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877F2] hover:bg-[#1874E8]',
    textColor: 'text-white',
  },
] as const

export function SocialLoginButtons() {
  const { signInWithProvider } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    try {
      setLoadingProvider(provider)
      await signInWithProvider(provider as 'google' | 'facebook')
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <div className="grid gap-2">
        {PROVIDERS.map((provider) => {
          const Icon = provider.icon
          const isLoading = loadingProvider === provider.name

          return (
            <Button
              key={provider.name}
              variant="outline"
              className={`w-full ${provider.color} ${provider.textColor} ${provider.borderColor || ''}`}
              onClick={() => handleSocialLogin(provider.name)}
              disabled={!!loadingProvider}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icon className="mr-2 h-4 w-4" />
              )}
              {`Continue with ${provider.displayName}`}
            </Button>
          )
        })}
      </div>
    </div>
  )
} 
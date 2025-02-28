import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'

// Konfigurera OAuth-parametrar för varje plattform
const OAUTH_CONFIG = {
  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload'
    ],
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
  },
}

export async function GET(
  request: Request,
  { params }: { params: { platform: 'youtube' | 'facebook' } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const platform = params.platform
    if (!OAUTH_CONFIG[platform]) {
      return new NextResponse('Invalid platform', { status: 400 })
    }

    // Hämta OAuth-konfiguration för vald plattform
    const config = OAUTH_CONFIG[platform]
    const clientId = platform === 'youtube' 
      ? process.env.GOOGLE_CLIENT_ID 
      : process.env.FACEBOOK_APP_ID

    if (!clientId) {
      throw new Error(`Missing client ID for ${platform}`)
    }

    // Generera state för att förhindra CSRF-attacker
    const state = Buffer.from(JSON.stringify({
      userId: user.id,
      platform,
      timestamp: Date.now(),
    })).toString('base64')

    // Bygg OAuth URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/${platform}`
    const authUrl = new URL(config.authUrl)
    
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', config.scopes.join(' '))
    authUrl.searchParams.append('state', state)
    
    if (platform === 'youtube') {
      authUrl.searchParams.append('access_type', 'offline')
      authUrl.searchParams.append('prompt', 'consent')
    }

    return NextResponse.json({ url: authUrl.toString() })
  } catch (error) {
    console.error('OAuth URL generation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 
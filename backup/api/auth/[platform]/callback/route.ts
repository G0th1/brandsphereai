import { NextResponse } from 'next/server'

const TOKEN_ENDPOINTS = {
  youtube: 'https://oauth2.googleapis.com/token',
  facebook: 'https://graph.facebook.com/v18.0/oauth/access_token',
}

export async function POST(
  request: Request,
  { params }: { params: { platform: 'youtube' | 'facebook' } }
) {
  try {
    const { code, state } = await request.json()

    // Validera state för att förhindra CSRF
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString())
    if (Date.now() - decodedState.timestamp > 5 * 60 * 1000) { // 5 minuter
      return new NextResponse('State token expired', { status: 400 })
    }

    const platform = params.platform
    const clientId = platform === 'youtube' 
      ? process.env.GOOGLE_CLIENT_ID 
      : process.env.FACEBOOK_APP_ID
    const clientSecret = platform === 'youtube'
      ? process.env.GOOGLE_CLIENT_SECRET
      : process.env.FACEBOOK_APP_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/${platform}`

    if (!clientId || !clientSecret) {
      throw new Error(`Missing credentials for ${platform}`)
    }

    // Utbyt auktoriseringskod mot tokens
    const tokenResponse = await fetch(TOKEN_ENDPOINTS[platform], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed')
    }

    const tokenData = await tokenResponse.json()

    // Hämta användar-ID från respektive plattform
    let platformUserId: string
    if (platform === 'youtube') {
      const userResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })
      if (!userResponse.ok) throw new Error('Failed to fetch YouTube user data')
      const userData = await userResponse.json()
      platformUserId = userData.items[0].id
    } else {
      const userResponse = await fetch('https://graph.facebook.com/v18.0/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })
      if (!userResponse.ok) throw new Error('Failed to fetch Facebook user data')
      const userData = await userResponse.json()
      platformUserId = userData.id
    }

    return NextResponse.json({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      platformUserId,
    })
  } catch (error) {
    console.error('Token exchange error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 
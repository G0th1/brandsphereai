'use client'

import { PlausibleProvider } from 'next-plausible'

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Använd development domain lokalt, Netlify domain i produktion
  const domain = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || 'din-app.netlify.app'
    : 'localhost:3000'

  return (
    <PlausibleProvider 
      domain={domain}
      trackOutboundLinks
      enabled={process.env.NODE_ENV === 'production'}
    >
      {children}
    </PlausibleProvider>
  )
} 
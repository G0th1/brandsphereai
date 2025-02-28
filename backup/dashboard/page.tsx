"use client"

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Chrome, Facebook, Loader2, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { PlatformOverview } from '@/components/dashboard/platform-overview'
import { SchedulePostDialog } from '@/components/dashboard/schedule-post-dialog'

type Platform = {
  platform: 'youtube' | 'facebook'
  channel?: {
    title: string
    subscriberCount: number
    videoCount: number
    viewCount: number
  }
  pages?: Array<{
    id: string
    name: string
    category: string
    followerCount: number
    picture: string
  }>
  recentContent: Array<any>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  useEffect(() => {
    fetchPlatformData()
  }, [])

  const fetchPlatformData = async () => {
    try {
      const response = await fetch('/api/platforms')
      if (!response.ok) throw new Error('Kunde inte hämta plattformsdata')
      const data = await response.json()
      setPlatforms(data.platforms)
    } catch (error) {
      toast({
        title: 'Ett fel uppstod',
        description: 'Kunde inte hämta plattformsdata. Försök igen senare.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto p-6">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Välkommen tillbaka!</h1>
            <p className="text-muted-foreground mt-1">
              Hantera ditt innehåll på alla dina plattformar från ett ställe.
            </p>
          </div>
          <Button onClick={() => setShowScheduleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Skapa inlägg
          </Button>
        </div>

        {platforms.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Kom igång</CardTitle>
              <CardDescription>
                Du har inte anslutit några plattformar än. Börja med att ansluta dina sociala mediekonton.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="outline" onClick={() => {}}>
                <Chrome className="mr-2 h-4 w-4" />
                Anslut YouTube
              </Button>
              <Button variant="outline" onClick={() => {}}>
                <Facebook className="mr-2 h-4 w-4" />
                Anslut Facebook
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={platforms[0].platform} className="space-y-6">
            <TabsList>
              {platforms.map((platform) => (
                <TabsTrigger key={platform.platform} value={platform.platform}>
                  {platform.platform === 'youtube' ? (
                    <>
                      <Chrome className="mr-2 h-4 w-4" />
                      YouTube
                    </>
                  ) : (
                    <>
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {platforms.map((platform) => (
              <TabsContent key={platform.platform} value={platform.platform}>
                <PlatformOverview platform={platform} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
      <Footer />
      
      {showScheduleDialog && (
        <SchedulePostDialog
          platforms={platforms}
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
        />
      )}
    </div>
  )
}
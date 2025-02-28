'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Chrome, Facebook, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { youtubeService } from '@/lib/services/youtube-service'
import { facebookService } from '@/lib/services/facebook-service'

type Platform = {
  platform: 'youtube' | 'facebook'
  channel?: {
    title: string
  }
  pages?: Array<{
    id: string
    name: string
  }>
}

type SchedulePostDialogProps = {
  platforms: Platform[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SchedulePostDialog({ platforms, open, onOpenChange }: SchedulePostDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<'youtube' | 'facebook'>(
    platforms[0]?.platform || 'youtube'
  )
  const [selectedPageId, setSelectedPageId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledFor: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      const scheduledDate = new Date(formData.scheduledFor)

      if (selectedPlatform === 'youtube') {
        await youtubeService.scheduleVideoUpload(
          user.id,
          formData.title,
          formData.description,
          scheduledDate
        )
      } else {
        if (!selectedPageId) {
          toast({
            title: 'Välj en sida',
            description: 'Du måste välja en Facebook-sida för att schemalägga ett inlägg.',
            variant: 'destructive',
          })
          return
        }

        await facebookService.schedulePost(
          user.id,
          selectedPageId,
          formData.description,
          scheduledDate
        )
      }

      toast({
        title: 'Inlägg schemalagt',
        description: 'Ditt inlägg har schemalagts och kommer att publiceras automatiskt.',
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte schemalägga inlägget. Försök igen senare.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schemalägga ett inlägg</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedPlatform} onValueChange={(v: any) => setSelectedPlatform(v)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="youtube">
              <Chrome className="mr-2 h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="facebook">
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="youtube">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Beskrivning</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facebook">
              <div className="space-y-4">
                {platforms.find((p) => p.platform === 'facebook')?.pages && (
                  <div>
                    <Label htmlFor="page">Sida</Label>
                    <select
                      id="page"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedPageId}
                      onChange={(e) => setSelectedPageId(e.target.value)}
                      required
                    >
                      <option value="">Välj en sida</option>
                      {platforms
                        .find((p) => p.platform === 'facebook')
                        ?.pages?.map((page) => (
                          <option key={page.id} value={page.id}>
                            {page.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                <div>
                  <Label htmlFor="description">Meddelande</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <div>
              <Label htmlFor="scheduledFor">Schemalägg för</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, scheduledFor: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Avbryt
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Schemalägger...
                  </>
                ) : (
                  'Schemalägg inlägg'
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ChevronLeft, Sparkles, Loader2, Calendar, AlertTriangle } from 'lucide-react'
import { contentService } from '@/services/content-service'
import { SocialMediaService } from '@/services/social-media-service'

export default function CreateContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('facebook')
  const [contentType, setContentType] = useState('post')
  const [generatedContent, setGeneratedContent] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [title, setTitle] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({
    facebook: false,
    youtube: false
  })

  // Hämta anslutningsstatus för sociala medier
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const status = await SocialMediaService.getConnectionStatus()
        setConnectionStatus(status)
      } catch (error) {
        console.error('Kunde inte hämta anslutningsstatus:', error)
      }
    }
    
    checkConnections()
  }, [])
  
  // Generera innehåll med AI
  const generateContent = async () => {
    if (!topic) {
      toast({
        title: "Ämne saknas",
        description: "Vänligen ange ett ämne för innehållet.",
        variant: "destructive"
      })
      return
    }

    setGenerating(true)
    
    try {
      // Simulera API-anrop med en timeout
      // I en produktionsversion skulle detta anropa en extern AI-tjänst
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const exampleContent = {
        facebook: {
          post: `📣 ${topic} - Nyheter!\n\nVi är glada att kunna dela med oss av de senaste nyheterna om ${topic}. Vår plattform fortsätter att utvecklas för att möta era behov.\n\n#${topic.replace(/\s+/g, '')} #innovation #socialmedia`,
          video: `Vill du lära dig mer om ${topic}? I denna video går vi igenom grunderna och delar med oss av våra bästa tips. Perfekt för både nybörjare och erfarna användare!\n\nGlöm inte att gilla och dela om du fann detta hjälpsamt.`
        },
        youtube: {
          post: `🔥 NYTT: Allt du behöver veta om ${topic} | Tips & tricks för 2025\n\nI denna video guidar vi dig genom allt du behöver veta om ${topic}. Från grunderna till avancerade tekniker.\n\nTidskoder:\n00:00 Introduktion\n01:30 Grunderna i ${topic}\n05:45 Avancerade tekniker\n10:20 Sammanfattning`,
          video: `Allt du behöver veta om ${topic} | Komplett guide 2025\n\nBeskrivning:\nVälkommen till vår kompletta guide om ${topic}! I denna video går vi igenom allt från grunden till avancerade tekniker som hjälper dig att lyckas med ${topic}.\n\nOm du tycker att denna video var hjälpsam, glöm inte att prenumerera och slå på notifikationer för fler videor om ${topic} och liknande ämnen.`
        }
      }
      
      // Välj lämpligt innehåll baserat på plattform och innehållstyp
      const content = exampleContent[platform][contentType]
      setGeneratedContent(content)
      
      // Sätt en standardtitel baserad på ämnet
      const defaultTitle = platform === 'youtube' 
        ? `${topic} - Ultimate Guide` 
        : `${topic} - Updates`
      setTitle(defaultTitle)
      
      // Spara förslaget i Supabase
      await contentService.createContentSuggestion({
        title: defaultTitle,
        content,
        platform: platform as 'facebook' | 'youtube',
        contentType: contentType as 'post' | 'video'
      })
      
      toast({
        title: "Innehåll genererat!",
        description: "AI har skapat innehåll baserat på ditt ämne."
      })
    } catch (error) {
      console.error('Fel vid generering av innehåll:', error)
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte generera innehåll. Försök igen senare.",
        variant: "destructive"
      })
    } finally {
      setGenerating(false)
    }
  }

  // Publicera eller schemalägg inlägg
  const handlePublish = async (schedule = false) => {
    if (!generatedContent) {
      toast({
        title: "Inget innehåll",
        description: "Vänligen generera innehåll först.",
        variant: "destructive"
      })
      return
    }

    if (schedule && !scheduledDate) {
      toast({
        title: "Inget datum valt",
        description: "Vänligen välj ett datum för schemaläggning.",
        variant: "destructive"
      })
      return
    }
    
    // Kontrollera om användaren är ansluten till vald plattform
    if (!connectionStatus[platform]) {
      toast({
        title: "Inte ansluten",
        description: `Du är inte ansluten till ${platform}. Gå till dashboard och anslut ditt konto först.`,
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      // Skapa innehållsobjekt
      const content = {
        title: title || `${topic} post`,
        content: generatedContent,
        platform: platform as 'facebook' | 'youtube',
        contentType: contentType as 'post' | 'video'
      }
      
      if (schedule) {
        // Schemalägga inlägg
        // 1. Spara i Supabase
        await contentService.schedulePost({
          ...content,
          scheduledFor: scheduledDate,
          status: 'scheduled'
        })
        
        // 2. Publicera via social media service (om ansluten)
        if (connectionStatus[platform]) {
          await SocialMediaService.publishContent(
            content,
            true,
            scheduledDate
          )
        }
        
        toast({
          title: "Inlägg schemalagt!",
          description: `Ditt inlägg har schemalagts för publicering ${scheduledDate}.`
        })
      } else {
        // Direktpublicering
        // Publicera via social media service
        await SocialMediaService.publishContent(content)
        
        toast({
          title: "Inlägg publicerat!",
          description: "Ditt inlägg har publicerats."
        })
      }
      
      // Navigera tillbaka till dashboard efter framgångsrik operation
      router.push('/dashboard')
    } catch (error) {
      console.error('Fel vid publicering/schemaläggning:', error)
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte slutföra operationen. Försök igen senare.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push('/dashboard')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Tillbaka till dashboard
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Skapa innehåll med AI</CardTitle>
                <CardDescription>
                  Beskriv ett ämne så genererar AI optimerat innehåll för dina sociala medier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Plattform</Label>
                  <Select 
                    value={platform} 
                    onValueChange={setPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj plattform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">
                        Facebook {!connectionStatus.facebook && "⚠️"}
                      </SelectItem>
                      <SelectItem value="youtube">
                        YouTube {!connectionStatus.youtube && "⚠️"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {!connectionStatus[platform] && (
                    <div className="text-xs text-amber-600 flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" /> 
                      Du är inte ansluten till {platform}. För att publicera behöver du ansluta i dashboard.
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentType">Typ av innehåll</Label>
                  <Select 
                    value={contentType} 
                    onValueChange={setContentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj innehållstyp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Inlägg</SelectItem>
                      <SelectItem value="video">Videobeskrivning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Ämne/nyckelord</Label>
                  <Input
                    id="topic"
                    placeholder="T.ex. digitala marknadsföringstips"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={generateContent} 
                  disabled={generating || !topic}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Genererar...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generera innehåll
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-1/2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Förhandsgranskning</CardTitle>
                <CardDescription>
                  Redigera innehållet vid behov innan publicering
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {generatedContent && (
                  <div className="mb-4 space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      placeholder="Ange en titel för inlägget"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                )}
                
                <Textarea 
                  placeholder="Genererat innehåll visas här..."
                  className="flex-grow min-h-[200px]"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
                
                {generatedContent && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Schemalägg publicering (valfritt)</Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handlePublish(true)}
                        disabled={loading || !scheduledDate}
                      >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                        Schemalägg
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handlePublish(false)}
                        disabled={loading}
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publicera nu
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 
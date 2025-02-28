"use client"

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Chrome, Facebook, Twitter, Linkedin, Instagram, Info, BarChart2, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { contentService, ScheduledPost } from '../../services/content-service'

export default function DashboardPage() {
  const router = useRouter();
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Funktion för att ansluta ett konto (i en riktig implementation skulle detta använda API:er)
  const connectAccount = (platform: string) => {
    // I en riktig implementation skulle detta öppna OAuth-flödet
    // För MVP simulerar vi bara att kontot har anslutits
    if (!connectedAccounts.includes(platform)) {
      setConnectedAccounts([...connectedAccounts, platform]);
    }
  };
  
  // Hämta schemalagda inlägg från Supabase
  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const posts = await contentService.getScheduledPosts();
        setScheduledPosts(posts);
      } catch (error) {
        console.error('Fel vid hämtning av schemalagda inlägg:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheduledPosts();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Välkommen till BrandSphereAI!</h1>
            <p className="text-muted-foreground mt-1">
              Din plattform för att skapa och hantera sociala medier-innehåll med AI-stöd.
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Skapa inlägg
          </Button>
        </div>

        {/* MVP Steg-för-steg guide */}
        <Card className="mb-8 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              MVP-status: Kom igång på 3 steg
            </CardTitle>
            <CardDescription>
              Denna version är en MVP (Minimum Viable Product) för att testa grundfunktioner. Följ dessa steg:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="space-y-6">
              <li className="flex items-start">
                <div className={`${connectedAccounts.length > 0 ? "bg-primary" : "bg-muted"} text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>1</div>
                <div>
                  <h3 className="font-medium">Anslut ditt första sociala mediekonto</h3>
                  <p className="text-muted-foreground mt-1 mb-2">Börja med att koppla ditt Facebook- eller YouTube-konto.</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={connectedAccounts.includes('facebook') ? "default" : "outline"} 
                      size="sm"
                      onClick={() => connectAccount('facebook')}
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      {connectedAccounts.includes('facebook') ? 'Ansluten' : 'Anslut Facebook'}
                    </Button>
                    <Button 
                      variant={connectedAccounts.includes('youtube') ? "default" : "outline"} 
                      size="sm"
                      onClick={() => connectAccount('youtube')}
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      {connectedAccounts.includes('youtube') ? 'Ansluten' : 'Anslut YouTube'}
                    </Button>
                  </div>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className={`${scheduledPosts.length > 0 ? "bg-primary" : "bg-muted"} text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>2</div>
                <div>
                  <h3 className="font-medium">Skapa ditt första inlägg</h3>
                  <p className="text-muted-foreground mt-1 mb-2">Testa att skapa ett inlägg med AI-hjälp och schemalägg det.</p>
                  <Button size="sm" onClick={() => router.push('/dashboard/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Skapa inlägg
                  </Button>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h3 className="font-medium">Ge feedback</h3>
                  <p className="text-muted-foreground mt-1 mb-2">Hjälp oss förbättra tjänsten genom att berätta vad du tycker.</p>
                  <Button variant="outline" size="sm" onClick={() => router.push('/feedback')}>
                    Skicka feedback
                  </Button>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                Prestationsöversikt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Inlägg publicerade</p>
              <div className="mt-4 h-[60px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-xs text-muted-foreground">Statistik tillgänglig efter publicering</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-green-500" />
                Kommande inlägg
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledPosts.length}</div>
              <p className="text-xs text-muted-foreground">Schemalagda inlägg</p>
              <div className="mt-4 h-[60px] overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground">Laddar...</p>
                  </div>
                ) : scheduledPosts.length === 0 ? (
                  <div className="flex items-center justify-center h-full border rounded-md bg-muted/20">
                    <p className="text-xs text-muted-foreground">Inget schemalagt inlägg</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scheduledPosts.slice(0, 2).map((post) => (
                      <div key={post.id} className="text-xs p-2 border rounded-md">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-muted-foreground">
                          {new Date(post.scheduledFor).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    ))}
                    {scheduledPosts.length > 2 && (
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => router.push('/dashboard/scheduled')}>
                        Visa alla ({scheduledPosts.length})
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Settings className="h-4 w-4 mr-2 text-orange-500" />
                Kontoöversikt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedAccounts.length}</div>
              <p className="text-xs text-muted-foreground">Anslutna konton</p>
              <div className="mt-4 h-[60px] flex items-center justify-center">
                {connectedAccounts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Inga anslutna konton</p>
                ) : (
                  <div className="flex space-x-2">
                    {connectedAccounts.includes('facebook') && <Facebook className="h-6 w-6 text-blue-600" />}
                    {connectedAccounts.includes('youtube') && <Chrome className="h-6 w-6 text-red-600" />}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plattformar att ansluta</CardTitle>
            <CardDescription>
              I denna MVP-version stöder vi anslutning till följande sociala medieplattformar:
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Facebook className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Facebook</h3>
                    <p className="text-sm text-muted-foreground">Anslut sidor och skapa inlägg</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant={connectedAccounts.includes('facebook') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => connectAccount('facebook')}
                >
                  {connectedAccounts.includes('facebook') ? 'Ansluten' : 'Anslut Facebook'}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Chrome className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-medium">YouTube</h3>
                    <p className="text-sm text-muted-foreground">Hantera videobeskrivningar och titlar</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant={connectedAccounts.includes('youtube') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => connectAccount('youtube')}
                >
                  {connectedAccounts.includes('youtube') ? 'Ansluten' : 'Anslut YouTube'}
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
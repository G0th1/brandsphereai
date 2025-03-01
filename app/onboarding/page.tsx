"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, ChevronRight, ChevronLeft, Target, Users, Sparkles, Award } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { onboardingService, BrandStrategy } from '@/services/onboarding-service'

// Konstanter
const AGE_RANGES = [
  { id: 'teens', label: '13-17 år' },
  { id: 'young-adults', label: '18-24 år' },
  { id: 'adults', label: '25-34 år' },
  { id: 'mid-adults', label: '35-44 år' },
  { id: 'older-adults', label: '45-54 år' },
  { id: 'seniors', label: '55+ år' },
]

const PLATFORM_OPTIONS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter' },
]

const INTENTION_OPTIONS = [
  { id: 'influence', label: 'Bli en inflytelserik röst i min nisch' },
  { id: 'business', label: 'Främja mitt företag eller min tjänst' },
  { id: 'personal', label: 'Bygga mitt personliga varumärke' },
  { id: 'community', label: 'Skapa en gemenskap kring mitt intresse' },
  { id: 'monetize', label: 'Tjäna pengar på mitt innehåll' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  
  // State
  const [userId, setUserId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [intention, setIntention] = useState('')
  const [audience, setAudience] = useState({
    ageRanges: [] as string[],
    interests: '',
    pains: '',
  })
  const [uvz, setUvz] = useState({
    broadCategory: '',
    subCategory: '',
    specificAudience: '',
  })
  const [platforms, setPlatforms] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(25)

  // Hämta användardata vid sidladdning
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Inte inloggad",
          description: "Du måste vara inloggad för att slutföra onboarding.",
          variant: "destructive"
        })
        router.push('/login')
        return
      }
      
      setUserId(session.user.id)
      
      // Hämta eventuell befintlig strategi
      const strategy = await onboardingService.getBrandStrategy(session.user.id)
      if (strategy) {
        // Förfyll formuläret med befintlig data
        setIntention(strategy.intention)
        setAudience(strategy.audience)
        setUvz(strategy.uvz)
        setPlatforms(strategy.platforms)
        toast({
          title: "Välkommen tillbaka!",
          description: "Vi har laddat din tidigare strategi. Du kan fortsätta där du slutade eller göra ändringar.",
        })
      }
    }
    
    checkUser()
  }, [])

  // Uppdatera progress bar baserat på aktuellt steg
  useEffect(() => {
    setProgress(currentStep * 25)
  }, [currentStep])

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
    window.scrollTo(0, 0)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Intention
        if (!intention) {
          toast({
            title: "Välj ett syfte",
            description: "Du måste välja ett syfte för ditt personliga varumärke",
            variant: "destructive"
          })
          return false
        }
        return true
      
      case 2: // Målgrupp
        if (audience.ageRanges.length === 0) {
          toast({
            title: "Välj åldersgrupp",
            description: "Du måste välja minst en åldersgrupp för din målgrupp",
            variant: "destructive"
          })
          return false
        }
        if (!audience.interests.trim()) {
          toast({
            title: "Ange intressen",
            description: "Du måste beskriva din målgrupps intressen",
            variant: "destructive"
          })
          return false
        }
        if (!audience.pains.trim()) {
          toast({
            title: "Ange utmaningar",
            description: "Du måste beskriva din målgrupps utmaningar eller problem",
            variant: "destructive"
          })
          return false
        }
        return true
      
      case 3: // UVZ
        if (!uvz.broadCategory.trim()) {
          toast({
            title: "Ange bred kategori",
            description: "Du måste ange en bred kategori för ditt innehåll",
            variant: "destructive"
          })
          return false
        }
        if (!uvz.subCategory.trim()) {
          toast({
            title: "Ange underkategori",
            description: "Du måste ange en mer specifik underkategori",
            variant: "destructive"
          })
          return false
        }
        if (!uvz.specificAudience.trim()) {
          toast({
            title: "Ange specifik målgrupp",
            description: "Du måste specificera din målgrupp mer detaljerat",
            variant: "destructive"
          })
          return false
        }
        return true
      
      case 4: // Plattformar
        if (platforms.length === 0) {
          toast({
            title: "Välj plattformar",
            description: "Du måste välja minst en plattform för ditt innehåll",
            variant: "destructive"
          })
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleCompleteOnboarding = async () => {
    if (!userId) {
      toast({
        title: "Ett fel inträffade",
        description: "Vi kunde inte identifiera din användare. Försök logga in igen.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const strategy: BrandStrategy = {
        userId,
        intention,
        audience,
        uvz,
        platforms
      }
      
      const result = await onboardingService.saveBrandStrategy(strategy)
      
      if (result) {
        toast({
          title: "Onboarding slutförd!",
          description: "Din varumärkesstrategi har sparats. Nu kan du börja skapa innehåll.",
        })
        
        // Omdirigera till dashboard
        router.push('/dashboard')
      } else {
        throw new Error("Kunde inte spara varumärkesstrategin")
      }
    } catch (error) {
      console.error("Error saving brand strategy:", error)
      toast({
        title: "Ett fel inträffade",
        description: "Vi kunde inte spara din varumärkesstrategi. Försök igen senare.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleAgeRange = (value: string) => {
    setAudience(prev => {
      const newAgeRanges = prev.ageRanges.includes(value)
        ? prev.ageRanges.filter(range => range !== value)
        : [...prev.ageRanges, value]
      
      return {
        ...prev,
        ageRanges: newAgeRanges
      }
    })
  }

  const togglePlatform = (value: string) => {
    setPlatforms(prev => 
      prev.includes(value) 
        ? prev.filter(platform => platform !== value)
        : [...prev, value]
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Definiera din varumärkesstrategi</h1>
            <p className="text-muted-foreground mt-1">
              Följ dessa steg för att skapa ett starkt personligt varumärke som sticker ut på sociala medier
            </p>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                <span>Steg {currentStep} av 4</span>
                <span>{progress}% klart</span>
              </div>
            </div>
          </div>
          
          {/* Steg 1: Intention */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Steg 1: Definiera ditt syfte
                </CardTitle>
                <CardDescription>
                  Vad vill du uppnå med ditt personliga varumärke? Välj det alternativ som bäst beskriver din huvudsakliga målsättning.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={intention} onValueChange={setIntention} className="space-y-4">
                  {INTENTION_OPTIONS.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`intention-${option.id}`} />
                      <Label htmlFor={`intention-${option.id}`} className="font-medium">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextStep}>Nästa steg</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Steg 2: Target Audience */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Steg 2: Definiera din målgrupp
                </CardTitle>
                <CardDescription>
                  Beskriv de personer som kommer att vara mest intresserade av ditt innehåll och som du vill nå ut till.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Vilka åldersgrupper vill du nå? (Välj en eller flera)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {AGE_RANGES.map(range => (
                      <div key={range.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`age-${range.id}`} 
                          checked={audience.ageRanges.includes(range.id)} 
                          onCheckedChange={() => toggleAgeRange(range.id)}
                        />
                        <Label htmlFor={`age-${range.id}`}>{range.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Vad är din målgrupps huvudsakliga intressen?</h3>
                  <Textarea 
                    placeholder="T.ex: fitness, personlig utveckling, teknik, matlagning, resor..."
                    value={audience.interests}
                    onChange={e => setAudience(prev => ({ ...prev, interests: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Vilka utmaningar eller problem har din målgrupp?</h3>
                  <Textarea 
                    placeholder="T.ex: brist på tid, svårt att hitta motivation, behöver mer kunskap inom..."
                    value={audience.pains}
                    onChange={e => setAudience(prev => ({ ...prev, pains: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>Föregående</Button>
                <Button onClick={handleNextStep}>Nästa steg</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Steg 3: Unique Value Zone (UVZ) */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Steg 3: Definiera din unika värdezon (UVZ)
                </CardTitle>
                <CardDescription>
                  Din unika värdezon är den specifika nisch där ditt personliga varumärke kommer att utmärka sig. 
                  Ju mer specifik, desto bättre!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Bred kategori</h3>
                  <p className="text-sm text-muted-foreground mb-2">Välj en övergripande kategori för ditt innehåll</p>
                  <Input 
                    placeholder="T.ex: Fitness, Ekonomi, Teknologi, Mode..."
                    value={uvz.broadCategory}
                    onChange={e => setUvz(prev => ({ ...prev, broadCategory: e.target.value }))}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Specifik underkategori</h3>
                  <p className="text-sm text-muted-foreground mb-2">Smalare nisch inom den breda kategorin</p>
                  <Input 
                    placeholder="T.ex: Styrketräning, Personlig investering, AI-utveckling, Hållbart mode..."
                    value={uvz.subCategory}
                    onChange={e => setUvz(prev => ({ ...prev, subCategory: e.target.value }))}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">För vilken specifik målgrupp?</h3>
                  <p className="text-sm text-muted-foreground mb-2">Vilken specifik grupp inom din målgrupp vill du nå?</p>
                  <Input 
                    placeholder="T.ex: Nybörjare, Småföretagare, Studenter, Föräldrar..."
                    value={uvz.specificAudience}
                    onChange={e => setUvz(prev => ({ ...prev, specificAudience: e.target.value }))}
                  />
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Din unika värdezon:</h3>
                  <p className="font-bold">
                    {uvz.broadCategory && uvz.subCategory && uvz.specificAudience
                      ? `${uvz.broadCategory} > ${uvz.subCategory} > För ${uvz.specificAudience}`
                      : "Fyll i alla tre fält för att se din unika värdezon"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>Föregående</Button>
                <Button onClick={handleNextStep}>Nästa steg</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Steg 4: Platform Selection */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Steg 4: Välj dina plattformar
                </CardTitle>
                <CardDescription>
                  Välj de plattformar där du vill bygga ditt personliga varumärke. 
                  Vi rekommenderar att börja med 1-3 plattformar för att fokusera dina insatser.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {PLATFORM_OPTIONS.map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`platform-${platform.id}`} 
                        checked={platforms.includes(platform.id)} 
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                      <Label htmlFor={`platform-${platform.id}`}>{platform.label}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Sammanfattning av din varumärkesstrategi</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Syfte:</h4>
                      <p>{INTENTION_OPTIONS.find(opt => opt.id === intention)?.label || "Ej valt"}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Målgrupp:</h4>
                      <p>
                        <span className="block">Ålder: {audience.ageRanges.map(id => 
                          AGE_RANGES.find(r => r.id === id)?.label).join(', ') || "Ej valt"}
                        </span>
                        <span className="block">Intressen: {audience.interests || "Ej angivet"}</span>
                        <span className="block">Utmaningar: {audience.pains || "Ej angivet"}</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Unik värdezon:</h4>
                      <p>{`${uvz.broadCategory} > ${uvz.subCategory} > För ${uvz.specificAudience}` || "Ej komplett"}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Plattformar:</h4>
                      <p>{platforms.map(id => 
                        PLATFORM_OPTIONS.find(p => p.id === id)?.label).join(', ') || "Ej valt"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>Föregående</Button>
                <Button 
                  onClick={handleCompleteOnboarding}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sparar..." : "Slutför & spara strategi"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 
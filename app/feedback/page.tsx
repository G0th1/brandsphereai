'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ThumbsUp, Check, Star } from 'lucide-react'

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // I en MVP skulle vi bara simulera inlämning
    // I en riktig implementation skulle vi skicka data till Supabase
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Hjälp oss förbättra BrandSphereAI</h1>
            <p className="text-muted-foreground mt-2">
              Som MVP-testare är din feedback ovärderlig för oss. Dela med dig av dina tankar och hjälp oss bygga en bättre produkt.
            </p>
          </div>

          {submitted ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2">Tack för din feedback!</h2>
                <p className="text-muted-foreground">
                  Dina synpunkter hjälper oss att förbättra BrandSphereAI för alla användare. 
                  Vi uppskattar din tid och ditt engagemang som MVP-testare.
                </p>
                <Button className="mt-6" onClick={() => window.location.href = '/dashboard'}>
                  Tillbaka till dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>MVP Feedback</CardTitle>
                  <CardDescription>
                    Berätta vad du tycker om BrandSphereAI så här långt.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="overall">Hur skulle du betygsätta din upplevelse?</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={`p-2 rounded-full transition-colors ${
                            rating === value 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <Star 
                            className={`h-6 w-6 ${rating && value <= rating ? 'fill-current' : ''}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="feature-most">Vilken funktion gillade du mest?</Label>
                    <Input 
                      id="feature-most" 
                      className="mt-1.5" 
                      placeholder="t.ex. AI-generering av inlägg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="feature-missing">Vilka funktioner saknar du?</Label>
                    <Input 
                      id="feature-missing" 
                      className="mt-1.5" 
                      placeholder="t.ex. integration med Instagram"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">Förslag på förbättringar</Label>
                    <Textarea 
                      id="improvements" 
                      className="mt-1.5" 
                      placeholder="Berätta hur vi kan göra BrandSphereAI bättre"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="user-type">Vilken typ av användare är du?</Label>
                    <select 
                      id="user-type" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 mt-1.5"
                    >
                      <option value="">Välj typ...</option>
                      <option value="creator">Innehållsskapare / Influencer</option>
                      <option value="business">Småföretagare</option>
                      <option value="marketing">Marknadsförare</option>
                      <option value="agency">Byrå / Konsult</option>
                      <option value="other">Annat</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Skicka feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 
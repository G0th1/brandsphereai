"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { ChevronLeft, Check, CreditCard, Lock, Loader2 } from 'lucide-react'

// MVP: Simulerade betalningsplaner
const plans = {
  pro: {
    name: 'Pro',
    price: '199 kr',
    period: '/månad',
    description: 'För innehållsskapare som vill växa',
    features: [
      'Hantera upp till 10 sociala mediekonton',
      'Avancerad statistik och insikter',
      'AI-genererat innehållsförslag',
      'Obegränsat antal inlägg',
      'Schemaläggning av inlägg',
      'Prioriterad support',
    ],
    priceId: 'price_pro_monthly_199',
  },
  enterprise: {
    name: 'Företag',
    price: 'Kontakta oss',
    period: '',
    description: 'För team och större organisationer',
    features: [
      'Obegränsat antal sociala mediekonton',
      'Fullständig statistik och analys',
      'AI-optimerad innehållsstrategi',
      'Integration med marknadsföringsverktyg',
      'Team-samarbete',
      'Dedikerad kontaktperson',
      'API-åtkomst',
    ],
    priceId: 'contact_sales',
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Hämta plan från URL-parametrar, standardvärde 'pro'
  const planId = searchParams.get('plan') || 'pro'
  const plan = plans[planId] || plans.pro
  
  // Om enterprise-planen väljs, omdirigera till kontaktsidan
  if (plan.priceId === 'contact_sales') {
    router.push('/contact')
    return null
  }
  
  // Tillståndsvariabler för formuläret
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validera formuläret
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      toast({
        title: "Formuläret är ofullständigt",
        description: "Vänligen fyll i alla fält.",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    
    // Simulera betalningsbehandling
    setTimeout(() => {
      setLoading(false)
      
      toast({
        title: "Prenumeration aktiverad!",
        description: "Din Pro-plan är nu aktiv."
      })
      
      // Omdirigera till dashboard efter framgångsrik betalning
      router.push('/dashboard')
    }, 2000)
  }
  
  // Hjälpfunktion för att formatera kortnummer
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }
  
  // Hjälpfunktion för att formatera utgångsdatum
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    
    return v
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push('/pricing')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Tillbaka till prisplaner
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Betalningsinformation</CardTitle>
                <CardDescription>
                  Fyll i dina betalningsuppgifter för att aktivera din prenumeration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Namn på kortet</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Kortnummer</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Utgångsdatum</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/ÅÅ"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Bearbetar...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Betala {plan.price}
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center text-xs text-muted-foreground flex items-center justify-center mt-4">
                    <Lock className="h-3 w-3 mr-1" /> Säker betalning med kryptering
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-3xl font-bold">{plan.price}<span className="text-base font-normal text-muted-foreground">{plan.period}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">Betala månadsvis, avsluta när som helst</p>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 px-6 py-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>14 dagars pengarna-tillbaka-garanti</p>
                    <p>Fullständig tillgång till alla Pro-funktioner</p>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-4 text-sm text-muted-foreground text-center space-y-2">
                <p>Har du frågor? <a href="/contact" className="text-primary underline">Kontakta oss</a></p>
                <p>Genom att slutföra detta köp godkänner du våra <a href="/terms" className="text-primary underline">användarvillkor</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 
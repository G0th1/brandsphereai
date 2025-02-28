'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const pricingPlans = [
  {
    name: 'Gratis',
    price: '0 kr',
    description: 'För hobbykreatörer och nybörjare',
    features: [
      'Hantera upp till 3 sociala mediekonton',
      'Grundläggande statistik och insikter',
      'Manuell innehållsskapande',
      'Upp till 10 inlägg per månad',
      'Email support',
    ],
    cta: 'Kom igång gratis',
    href: '/signup',
    highlighted: false,
  },
  {
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
    cta: 'Börja 14 dagars gratis provperiod',
    href: '/checkout?plan=pro',
    highlighted: true,
    special: 'MVP lanseringspris - 50% rabatt!',
    originalPrice: '399 kr',
  },
  {
    name: 'Företag',
    price: 'Kontakta oss',
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
    cta: 'Kontakta oss',
    href: '/checkout?plan=enterprise',
    highlighted: false,
  },
]

export default function PricingPage() {
  const router = useRouter();
  
  return (
    <div className="bg-background">
      <div className="py-24 px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Prissättning
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Välj en plan som passar dina behov. Alla planer inkluderar gratis uppgradering till nästa version.
          </p>
          
          {/* MVP Banner */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <Info className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                <strong>MVP-erbjudande:</strong> Under vår testperiod erbjuder vi specialpriser för early adopters. Hjälp oss förbättra produkten och få livstids rabatt!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-primary text-primary-foreground ring-1 ring-primary/50 sm:mx-0 sm:p-10'
                  : 'bg-card text-card-foreground ring-1 ring-ring/10 sm:-mx-6 sm:p-8'
              }`}
            >
              <h2 className="text-lg font-semibold leading-8">{plan.name}</h2>
              
              {/* Lägg till MVP specialerbjudande */}
              {plan.special && (
                <div className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-md ${plan.highlighted ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                  {plan.special}
                </div>
              )}
              
              <p
                className={`mt-4 flex items-baseline gap-x-2 ${
                  plan.highlighted ? '' : ''
                }`}
              >
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm font-semibold leading-6">
                    {plan.period}
                  </span>
                )}
              </p>
              
              {/* Visa originalpris om det finns */}
              {plan.originalPrice && (
                <p className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'} line-through mt-1`}>
                  Ordinarie: {plan.originalPrice}{plan.period}
                </p>
              )}
              
              <p className="mt-2 text-sm leading-6">{plan.description}</p>
              <ul
                className={`mt-8 space-y-3 ${
                  plan.highlighted
                    ? 'text-primary-foreground'
                    : 'text-foreground'
                }`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={`h-6 w-5 flex-none ${
                        plan.highlighted ? 'text-primary-foreground' : 'text-primary'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  plan.highlighted
                    ? 'bg-background text-foreground hover:bg-background/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                onClick={() => router.push(plan.href)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mx-auto max-w-2xl text-center mt-20">
          <h2 className="text-3xl font-bold tracking-tight">
            Osäker på vilken plan som passar dig?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Boka en gratis produktdemo och få råd från vårt team.
          </p>
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="mx-auto"
              onClick={() => router.push('/contact')}
            >
              Boka demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
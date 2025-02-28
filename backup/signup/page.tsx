"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { BrainCircuit, Loader2 } from "lucide-react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/auth-context'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SocialLoginButtons } from '@/components/auth/social-login-buttons'

const signupSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z
    .string()
    .min(6, 'Lösenordet måste vara minst 6 tecken')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Lösenordet måste innehålla minst en stor bokstav, en liten bokstav och en siffra'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Lösenorden matchar inte',
  path: ['confirmPassword'],
})

type SignupValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: SignupValues) {
    try {
      setIsLoading(true)
      await signUp(data.email, data.password)
      toast({
        title: 'Registrering lyckades',
        description: 'Kontrollera din e-post för att verifiera ditt konto.',
      })
      router.push('/login')
    } catch (error) {
      toast({
        title: 'Något gick fel',
        description: 'Ett fel uppstod vid registreringen. Försök igen.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <BrainCircuit className="h-10 w-10 text-orange-500" />
            <h1 className="text-2xl font-bold">Create your BrandAI account</h1>
            <p className="text-muted-foreground text-center">
              Start managing your personal brand with AI
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="namn@exempel.se"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lösenord</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bekräfta lösenord</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-900 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrerar...
                    </>
                  ) : (
                    "Registrera"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <SocialLoginButtons />
            </div>
            
            <div className="mt-6 text-center text-sm">
              Har du redan ett konto?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Logga in
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
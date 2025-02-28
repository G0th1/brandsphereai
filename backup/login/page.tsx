"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

const loginSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(6, 'Lösenordet måste vara minst 6 tecken'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginValues) {
    try {
      setIsLoading(true)
      await signIn(data.email, data.password)
      router.push('/dashboard')
      toast({
        title: 'Inloggning lyckades',
        description: 'Välkommen tillbaka!',
      })
    } catch (error) {
      toast({
        title: 'Något gick fel',
        description: 'Kontrollera dina uppgifter och försök igen.',
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
            <h1 className="text-2xl font-bold">Welcome back to BrandAI</h1>
            <p className="text-muted-foreground text-center">
              Log in to your account to manage your personal brand
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-900 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loggar in...
                    </>
                  ) : (
                    "Logga in"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <SocialLoginButtons />
            </div>
            
            <div className="mt-6 text-center text-sm">
              Har du inget konto?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Registrera dig
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
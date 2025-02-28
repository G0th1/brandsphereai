import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, HelpCircle, Sparkles } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-950 to-blue-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-block bg-blue-800/50 p-2 rounded-lg mb-2">
                <Sparkles className="h-6 w-6 text-orange-400" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Choose the Perfect Plan for Your <span className="text-orange-400">Brand Growth</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                Start for free, upgrade as you grow. All plans include core features to help you build and manage your personal brand.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for beginners</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>AI-powered content suggestions (5/month)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Basic social media post scheduling (1 account)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Limited analytics (last 7 days)</span>
                    </li>
                    <li className="flex items-start text-muted-foreground">
                      <HelpCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                      <span>Personalized branding recommendations</span>
                    </li>
                    <li className="flex items-start text-muted-foreground">
                      <HelpCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-blue-900 hover:bg-blue-800">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-orange-400 relative hover:shadow-xl transition-all duration-200 scale-105">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Growth</CardTitle>
                  <CardDescription>For serious brand builders</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$19</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Unlimited</strong> AI content suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Schedule & post across 3 social accounts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced analytics (30-day trends)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Personalized branding recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Start 14-Day Free Trial
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Elite</CardTitle>
                  <CardDescription>For professional influencers</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>AI-driven content strategy with trend forecasting</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Schedule & post across <strong>unlimited</strong> accounts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Reputation monitoring (mentions & sentiment)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Custom AI-powered branding insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Dedicated support + early access features</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-blue-900 hover:bg-blue-800">
                      Start 14-Day Free Trial
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Can I change plans later?</h3>
                  <p className="text-gray-600">
                    Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes to your subscription will take effect immediately.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Do I need a credit card for the free plan?</h3>
                  <p className="text-gray-600">
                    No, you can sign up for the Starter plan without providing any payment information. It's completely free to use.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">What happens when my trial ends?</h3>
                  <p className="text-gray-600">
                    After your 14-day trial, you'll be automatically switched to the paid plan you selected. We'll send you a reminder email 3 days before your trial ends.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Can I get a refund if I'm not satisfied?</h3>
                  <p className="text-gray-600">
                    Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with our service, contact our support team for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Elevate Your Personal Brand?</h2>
              <p className="text-lg text-gray-300">
                Join thousands of creators who are growing their audience and influence with BrandAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
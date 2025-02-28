import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  MessageSquareText, 
  Sparkles, 
  TrendingUp,
  Zap,
  Rocket,
  Target
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-blue-950 via-blue-900 to-purple-900 text-white overflow-hidden relative">
          {/* Abstract shapes for visual interest */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animationDelay: "1s", animationDuration: "4s"}}></div>
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-800/50 text-orange-400 text-sm font-medium mb-2 w-fit">
                  <Zap className="h-4 w-4 mr-1" /> Next-Gen Personal Branding
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Level Up Your <span className="text-orange-400">Personal Brand</span> with AI
                </h1>
                <p className="text-lg text-gray-300 max-w-md">
                  Create content that slaps, schedule posts that pop, and grow your audience—all powered by AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 pulse-glow">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      View Pricing
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-orange-400" />
                  <span>No credit card required</span>
                </div>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Dashboard preview" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span>AI just generated your next viral post</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4">
                <Rocket className="h-4 w-4 mr-1" /> Supercharge Your Online Presence
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Features That Make You Stand Out</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to build your personal brand and grow your audience in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-6">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Content Creation</h3>
                <p className="text-gray-600">
                  Get personalized content suggestions tailored to your unique voice and what your audience actually wants to see.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-orange-100 p-3 rounded-full w-fit mb-6">
                  <Calendar className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Scheduling</h3>
                <p className="text-gray-600">
                  Schedule posts at peak engagement times across all your platforms to maximize reach and interaction.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-green-100 p-3 rounded-full w-fit mb-6">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
                <p className="text-gray-600">
                  Track what's working with detailed analytics that show you exactly how to improve your content strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
                <Target className="h-4 w-4 mr-1" /> Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How BrandAI Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Three simple steps to transform your personal brand with AI.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">1</div>
                <h3 className="text-xl font-semibold mb-3">Connect Your Accounts</h3>
                <p className="text-gray-600">
                  Link your social profiles to BrandAI and tell us about your brand vibe and goals.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">2</div>
                <h3 className="text-xl font-semibold mb-3">Get AI Suggestions</h3>
                <p className="text-gray-600">
                  Receive personalized content ideas and post suggestions based on what's trending.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg">3</div>
                <h3 className="text-xl font-semibold mb-3">Schedule & Grow</h3>
                <p className="text-gray-600">
                  Schedule posts at optimal times and track performance to level up your strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
                <MessageSquareText className="h-4 w-4 mr-1" /> Real Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of creators who've transformed their online presence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                      alt="Sarah Johnson" 
                      width={50} 
                      height={50} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Content Creator, 22</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "BrandAI is literally a game-changer! I've saved so much time on content creation, and my engagement has gone up by 40%. The AI suggestions are spot-on!"
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                      alt="David Chen" 
                      width={50} 
                      height={50} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">David Chen</h4>
                    <p className="text-sm text-gray-500">Tech Influencer, 24</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The analytics dashboard is fire! I can finally see exactly what content hits with my audience and why. My follower count has doubled in just 3 months."
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                      alt="Michelle Taylor" 
                      width={50} 
                      height={50} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michelle Taylor</h4>
                    <p className="text-sm text-gray-500">Lifestyle Blogger, 25</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "As a solo creator, BrandAI feels like having a full marketing team. The scheduling feature alone has doubled my productivity and consistency."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
          {/* Abstract shapes for visual interest */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animationDelay: "1.5s", animationDuration: "4s"}}></div>
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Blow Up Your Personal Brand?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of creators who are using AI to grow their online presence and influence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 pulse-glow">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-400" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-400" />
                  <span className="text-sm">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-400" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
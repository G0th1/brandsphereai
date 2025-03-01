"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  CalendarDays,
  Download,
  Calendar
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { sv } from "date-fns/locale";

interface AnalyticsData {
  impressions: number;
  engagements: number;
  clicks: number;
  shares: number;
  follows: number;
  totalPosts: number;
}

interface PlatformData {
  platform: string;
  followers: number;
  growth: number;
  posts: number;
  engagement: number;
}

interface ContentPerformance {
  id: string;
  title: string;
  platform: string;
  published_at: string;
  impressions: number;
  engagement: number;
  clicks: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    impressions: 0,
    engagements: 0,
    clicks: 0,
    shares: 0,
    follows: 0,
    totalPosts: 0
  });
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  
  // Hämta användardata och analysdata
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }
        
        setUser({
          id: session.user.id,
          email: session.user.email || ""
        });
        
        // I en riktig implementation skulle vi hämta faktisk analysdata från en tabell
        // Här simulerar vi data för demo-ändamål
        await fetchAnalyticsData(session.user.id);
        
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);
  
  // Simulerar hämtning av analysdata (i en riktig app skulle detta komma från API:er)
  const fetchAnalyticsData = async (userId: string) => {
    // Simulera lite väntetid som ett realistiskt API-anrop skulle ha
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generera simulerad analysdata baserat på tidsspann
    const multiplier = timeRange === "7days" ? 1 : timeRange === "30days" ? 4 : 12;
    
    // Övergripande analysdata
    setAnalyticsData({
      impressions: Math.floor(3250 * multiplier * (0.9 + Math.random() * 0.2)),
      engagements: Math.floor(420 * multiplier * (0.9 + Math.random() * 0.2)),
      clicks: Math.floor(180 * multiplier * (0.9 + Math.random() * 0.2)),
      shares: Math.floor(65 * multiplier * (0.9 + Math.random() * 0.2)),
      follows: Math.floor(12 * multiplier * (0.9 + Math.random() * 0.2)),
      totalPosts: Math.floor(8 * (timeRange === "7days" ? 0.5 : timeRange === "30days" ? 1 : 3))
    });
    
    // Plattformsdata
    setPlatformData([
      {
        platform: "Instagram",
        followers: 1240 + Math.floor(Math.random() * 50) * multiplier,
        growth: 2.4 + (Math.random() * 0.8),
        posts: Math.floor(3 * (timeRange === "7days" ? 0.5 : timeRange === "30days" ? 1 : 3)),
        engagement: 4.2 + (Math.random() * 0.6)
      },
      {
        platform: "LinkedIn",
        followers: 860 + Math.floor(Math.random() * 30) * multiplier,
        growth: 1.8 + (Math.random() * 0.6),
        posts: Math.floor(2 * (timeRange === "7days" ? 0.5 : timeRange === "30days" ? 1 : 3)),
        engagement: 3.1 + (Math.random() * 0.5)
      },
      {
        platform: "Facebook",
        followers: 580 + Math.floor(Math.random() * 20) * multiplier,
        growth: 0.9 + (Math.random() * 0.4),
        posts: Math.floor(3 * (timeRange === "7days" ? 0.5 : timeRange === "30days" ? 1 : 3)),
        engagement: 2.3 + (Math.random() * 0.4)
      }
    ]);
    
    // Innehållsprestanda
    const contentItems = [];
    const contentTitles = [
      "5 sätt att förbättra din digitala närvaro",
      "Varför personlig branding är viktigare än någonsin",
      "Så skapar du engagerande innehåll på LinkedIn",
      "Maximera din räckvidd på Instagram med dessa tips",
      "Hemligheter bakom framgångsrika personliga varumärken",
      "Så använder du AI för att förbättra din produktivitet",
      "Framtidstrender inom digital marknadsföring"
    ];
    
    const platforms = ["Instagram", "LinkedIn", "Facebook"];
    
    const posts = Math.min(analyticsData.totalPosts, contentTitles.length);
    
    for (let i = 0; i < posts; i++) {
      const daysAgo = Math.floor(Math.random() * (timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90));
      const date = subDays(new Date(), daysAgo);
      
      contentItems.push({
        id: `post-${i + 1}`,
        title: contentTitles[i],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        published_at: date.toISOString(),
        impressions: Math.floor(400 + Math.random() * 1600),
        engagement: Math.floor(5 + Math.random() * 15),
        clicks: Math.floor(10 + Math.random() * 90)
      });
    }
    
    // Sortera efter impressions för att få bäst presterande först
    contentItems.sort((a, b) => b.impressions - a.impressions);
    setContentPerformance(contentItems);
  };
  
  // Formaterar nummer för visning (t.ex. 1.2k istället för 1200)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  // Generera diagramdata för de senaste dagarna
  const generateChartData = () => {
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const labels = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      labels.push(format(date, 'dd MMM', { locale: sv }));
    }
    
    return labels;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Analysera prestandan för ditt innehåll och se vad som fungerar bäst
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <Select value={timeRange} onValueChange={(value: "7days" | "30days" | "90days") => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Välj tidsperiod" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Senaste 7 dagarna</SelectItem>
                <SelectItem value="30days">Senaste 30 dagarna</SelectItem>
                <SelectItem value="90days">Senaste 90 dagarna</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" disabled>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Översiktskort */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visningar
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.impressions)}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`flex items-center text-green-600`}>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5%
                </span>
                <span className="text-muted-foreground">jämfört med tidigare period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Engagemang
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.engagements)}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`flex items-center text-green-600`}>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.3%
                </span>
                <span className="text-muted-foreground">jämfört med tidigare period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Klick
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.clicks)}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`flex items-center text-red-600`}>
                  <ArrowDown className="h-3 w-3 mr-1" />
                  3.2%
                </span>
                <span className="text-muted-foreground">jämfört med tidigare period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delningar
              </CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.shares)}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`flex items-center text-green-600`}>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  15.8%
                </span>
                <span className="text-muted-foreground">jämfört med tidigare period</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Huvudinnehåll */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diagram */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Prestationstrend</CardTitle>
              <CardDescription>
                Visningar och engagemang över tid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="impressions">
                <TabsList className="mb-4">
                  <TabsTrigger value="impressions">Visningar</TabsTrigger>
                  <TabsTrigger value="engagement">Engagemang</TabsTrigger>
                  <TabsTrigger value="clicks">Klick</TabsTrigger>
                </TabsList>
                
                <TabsContent value="impressions" className="pt-2">
                  <div className="h-[300px] w-full flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center space-y-2">
                      <LineChart className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Diagramvy för visningar<br />
                        (Detta är en platshållare - i en riktig app skulle ett faktiskt diagram visas här)
                      </p>
                      <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                        {generateChartData().filter((_, i) => i % Math.floor(generateChartData().length / 5) === 0).map((label, i) => (
                          <span key={i}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="engagement" className="pt-2">
                  <div className="h-[300px] w-full flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center space-y-2">
                      <BarChart3 className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Diagramvy för engagemang<br />
                        (Detta är en platshållare - i en riktig app skulle ett faktiskt diagram visas här)
                      </p>
                      <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                        {generateChartData().filter((_, i) => i % Math.floor(generateChartData().length / 5) === 0).map((label, i) => (
                          <span key={i}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="clicks" className="pt-2">
                  <div className="h-[300px] w-full flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center space-y-2">
                      <LineChart className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Diagramvy för klick<br />
                        (Detta är en platshållare - i en riktig app skulle ett faktiskt diagram visas här)
                      </p>
                      <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                        {generateChartData().filter((_, i) => i % Math.floor(generateChartData().length / 5) === 0).map((label, i) => (
                          <span key={i}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Plattformsöversikt */}
          <Card>
            <CardHeader>
              <CardTitle>Plattformsöversikt</CardTitle>
              <CardDescription>
                Prestanda per social medie-plattform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platformData.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">{platform.platform}</h3>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {formatNumber(platform.followers)}
                        </span>
                        <span className="text-xs text-green-600 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                          {platform.growth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          platform.platform === 'Instagram' ? 'bg-pink-500' :
                          platform.platform === 'LinkedIn' ? 'bg-blue-700' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${(platform.engagement / 5) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{platform.posts} inlägg</span>
                      <span>{platform.engagement.toFixed(1)}% engagemang</span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 mt-4 border-t">
                  <div className="text-center space-y-2">
                    <PieChart className="h-6 w-6 text-primary mx-auto" />
                    <p className="text-xs text-muted-foreground">
                      Följarfördelning<br />
                      (Detta är en platshållare - i en riktig app skulle ett faktiskt diagram visas här)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bäst presterande innehåll */}
        <Card>
          <CardHeader>
            <CardTitle>Bäst presterande innehåll</CardTitle>
            <CardDescription>
              Ditt innehåll som genererat mest engagemang under perioden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentPerformance.map((content, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        content.platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                        content.platform === 'LinkedIn' ? 'bg-blue-100 text-blue-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {content.platform}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {format(new Date(content.published_at), 'dd MMM', { locale: sv })}
                      </div>
                    </div>
                    <CardTitle className="text-base truncate">{content.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Visningar</div>
                        <div className="text-sm font-medium">{formatNumber(content.impressions)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Engagemang</div>
                        <div className="text-sm font-medium">{content.engagement}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Klick</div>
                        <div className="text-sm font-medium">{formatNumber(content.clicks)}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" /> {Math.floor(10 + Math.random() * 50)}
                      </div>
                      <div className="flex items-center text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" /> {Math.floor(1 + Math.random() * 15)}
                      </div>
                      <div className="flex items-center text-xs">
                        <Share2 className="h-3 w-3 mr-1" /> {Math.floor(Math.random() * 10)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/content/${content.id}`)}>
                      Detaljer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/content-planning')}>
              Visa allt innehåll
            </Button>
          </CardFooter>
        </Card>
        
        {/* Insikter och rekommendationer */}
        <Card>
          <CardHeader>
            <CardTitle>Insikter & rekommendationer</CardTitle>
            <CardDescription>
              Baserat på din data har vi tagit fram dessa insikter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="text-base font-medium mb-2">Bästa tidpunkter för publicering</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Baserat på ditt innehålls prestanda, rekommenderar vi följande publiceringstider:
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Instagram</div>
                    <div className="text-muted-foreground">Tis & Tors, 18:00-20:00</div>
                  </div>
                  <div>
                    <div className="font-medium">LinkedIn</div>
                    <div className="text-muted-foreground">Mån & Ons, 08:00-10:00</div>
                  </div>
                  <div>
                    <div className="font-medium">Facebook</div>
                    <div className="text-muted-foreground">Ons & Fre, 12:00-14:00</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="text-base font-medium mb-2">Innehållsrekommendationer</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Baserat på ditt bäst presterande innehåll:
                </p>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>
                    <span className="font-medium">Öka visuellt innehåll</span>
                    <p className="text-muted-foreground ml-5">Inlägg med bilder har 2.3x högre engagemang</p>
                  </li>
                  <li>
                    <span className="font-medium">Experimentera med videor</span>
                    <p className="text-muted-foreground ml-5">Korta videor får 40% fler visningar</p>
                  </li>
                  <li>
                    <span className="font-medium">Använd berättande format</span>
                    <p className="text-muted-foreground ml-5">Personliga historier genererar 68% mer kommentarer</p>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="text-base font-medium mb-2">Hashtagg-prestanda</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Dina bäst presterande hashtaggar:
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    #personligvarumärke
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    #digitalmarketing
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    #socialmedia
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    #innehållsmarknadsföring
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    #ledarskap
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
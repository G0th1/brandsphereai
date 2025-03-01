"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Calendar, List, Grid3X3 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { sv } from "date-fns/locale";

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  status: string;
  scheduled_time: string;
  content: string;
  user_id: string;
}

export default function ContentPlanningPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list" | "grid">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredPlatform, setFilteredPlatform] = useState<string>("all");
  const [filteredStatus, setFilteredStatus] = useState<string>("all");
  
  // Hämta användares innehåll
  useEffect(() => {
    const fetchContentItems = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }
        
        const { data, error } = await supabase
          .from("scheduled_posts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("scheduled_time", { ascending: true });
        
        if (error) throw error;
        setContentItems(data || []);
      } catch (error) {
        console.error("Error loading content items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentItems();
  }, []);
  
  // Filtrera innehåll baserat på valda filter
  const filteredContent = contentItems.filter(item => {
    const matchesPlatform = filteredPlatform === "all" || item.platform === filteredPlatform;
    const matchesStatus = filteredStatus === "all" || item.status === filteredStatus;
    return matchesPlatform && matchesStatus;
  });
  
  // Navigationshjälpare för kalender
  const nextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };
  
  const prevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };
  
  // Generera kalenderdagar för aktuell månad
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Få innehåll för en specifik dag
  const getContentForDay = (day: Date) => {
    return filteredContent.filter(item => {
      const itemDate = new Date(item.scheduled_time);
      return isSameDay(itemDate, day);
    });
  };
  
  // Formatera plattformsnamn till färgkodad badge
  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      "instagram": "bg-pink-500",
      "linkedin": "bg-blue-700",
      "facebook": "bg-blue-500",
      "twitter": "bg-sky-400",
      "youtube": "bg-red-600",
    };
    
    return (
      <Badge variant="secondary" className={`${colors[platform.toLowerCase()] || "bg-gray-500"} text-white`}>
        {platform}
      </Badge>
    );
  };
  
  // Formatera status till färgkodad badge
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "scheduled": "bg-amber-500",
      "published": "bg-green-500",
      "draft": "bg-gray-500",
      "failed": "bg-red-500",
    };
    
    const labels: Record<string, string> = {
      "scheduled": "Schemalagd",
      "published": "Publicerad",
      "draft": "Utkast",
      "failed": "Misslyckad",
    };
    
    return (
      <Badge variant="secondary" className={`${colors[status.toLowerCase()] || "bg-gray-500"} text-white`}>
        {labels[status.toLowerCase()] || status}
      </Badge>
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Innehållsplanering</h1>
            <p className="text-muted-foreground mt-1">
              Planera och organisera ditt innehåll över tid
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Skapa nytt innehåll
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filter</CardTitle>
                <CardDescription>
                  Filtrera innehåll efter plattform och status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plattform</label>
                  <Select 
                    value={filteredPlatform} 
                    onValueChange={setFilteredPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alla plattformar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla plattformar</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={filteredStatus} 
                    onValueChange={setFilteredStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alla statusar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla statusar</SelectItem>
                      <SelectItem value="scheduled">Schemalagda</SelectItem>
                      <SelectItem value="published">Publicerade</SelectItem>
                      <SelectItem value="draft">Utkast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Vy</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant={view === "calendar" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView("calendar")}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Kalender
                    </Button>
                    <Button 
                      variant={view === "list" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4 mr-1" />
                      Lista
                    </Button>
                    <Button 
                      variant={view === "grid" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView("grid")}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Rutnät
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Totalt antal inlägg:</span>
                  <span className="font-medium">{contentItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Schemalagda:</span>
                  <span className="font-medium">
                    {contentItems.filter(i => i.status === "scheduled").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Publicerade:</span>
                  <span className="font-medium">
                    {contentItems.filter(i => i.status === "published").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Utkast:</span>
                  <span className="font-medium">
                    {contentItems.filter(i => i.status === "draft").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue={view} value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Kalender
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="grid">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Rutnät
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-0">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {format(currentDate, 'LLLL yyyy', { locale: sv })}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={prevMonth}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextMonth}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day) => (
                        <div 
                          key={day} 
                          className="text-center text-sm font-medium py-2"
                        >
                          {day}
                        </div>
                      ))}
                      
                      {/* Fylla ut början av månaden */}
                      {Array.from({ length: (monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1) }).map((_, index) => (
                        <div key={`empty-start-${index}`} className="min-h-[100px] border border-dashed rounded-md opacity-50" />
                      ))}
                      
                      {days.map((day) => {
                        const dayContentItems = getContentForDay(day);
                        
                        return (
                          <div 
                            key={day.toString()} 
                            className={`min-h-[100px] border rounded-md p-1 ${
                              isToday(day) ? 'border-primary' : 'border-border'
                            } overflow-hidden`}
                          >
                            <div className="text-right mb-1">
                              <span className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 ${
                                isToday(day) ? 'bg-primary text-primary-foreground' : ''
                              }`}>
                                {format(day, 'd')}
                              </span>
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[75px]">
                              {dayContentItems.map((item) => (
                                <div 
                                  key={item.id} 
                                  className="text-xs p-1 rounded bg-muted truncate cursor-pointer hover:bg-muted/80"
                                  onClick={() => router.push(`/dashboard/content/${item.id}`)}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-1 h-1 rounded-full mr-1 ${
                                      item.platform === "instagram" ? "bg-pink-500" :
                                      item.platform === "linkedin" ? "bg-blue-700" :
                                      item.platform === "facebook" ? "bg-blue-500" :
                                      "bg-gray-500"
                                    }`} />
                                    {item.title}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Fylla ut slutet av månaden */}
                      {Array.from({ length: (monthEnd.getDay() === 0 ? 0 : 7 - monthEnd.getDay()) }).map((_, index) => (
                        <div key={`empty-end-${index}`} className="min-h-[100px] border border-dashed rounded-md opacity-50" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Schemalagt innehåll</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredContent.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">Inget innehåll matchar din filtrering</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredContent.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded cursor-pointer"
                            onClick={() => router.push(`/dashboard/content/${item.id}`)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-base font-medium">{item.title}</h3>
                                {getPlatformBadge(item.platform)}
                                {getStatusBadge(item.status)}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {format(new Date(item.scheduled_time), 'PPP HH:mm', { locale: sv })}
                              </p>
                              <p className="text-sm line-clamp-2">{item.content}</p>
                            </div>
                            <div>
                              <Button variant="ghost" size="sm">
                                Redigera
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="grid" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Innehållsöversikt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredContent.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">Inget innehåll matchar din filtrering</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContent.map((item) => (
                          <Card 
                            key={item.id} 
                            className="hover:border-primary/50 cursor-pointer transition-all"
                            onClick={() => router.push(`/dashboard/content/${item.id}`)}
                          >
                            <CardHeader className="p-4 pb-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="space-y-1">
                                  <CardTitle className="text-base">{item.title}</CardTitle>
                                  <CardDescription>
                                    {format(new Date(item.scheduled_time), 'PPP', { locale: sv })}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex space-x-2 mt-2">
                                {getPlatformBadge(item.platform)}
                                {getStatusBadge(item.status)}
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <p className="text-sm line-clamp-3">{item.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 
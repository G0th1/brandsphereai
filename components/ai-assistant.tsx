"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, SendHorizonal, Clock, Lightbulb, MessageSquare, RefreshCw } from 'lucide-react';
import { aiAssistantService, ContentSuggestion, ContentFeedback, ScheduleSuggestion, CommandType } from '@/services/ai-assistant-service';
import { BrandStrategy } from '@/services/onboarding-service';

interface AIAssistantProps {
  userId: string;
  brandStrategy?: BrandStrategy;
}

export function AIAssistant({ userId, brandStrategy }: AIAssistantProps) {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  
  const [activeTab, setActiveTab] = useState('ideas');
  const [isLoading, setIsLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  
  // Content Ideas
  const [contentIdeas, setContentIdeas] = useState<ContentSuggestion[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [contentType, setContentType] = useState('mixed');
  const [ideasCount, setIdeasCount] = useState(5);
  
  // Content Feedback
  const [contentTitle, setContentTitle] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [feedbackPlatform, setFeedbackPlatform] = useState('');
  const [contentFeedback, setContentFeedback] = useState<ContentFeedback | null>(null);
  
  // Schedule Suggestions
  const [schedulePlatform, setSchedulePlatform] = useState('');
  const [scheduleData, setScheduleData] = useState<ScheduleSuggestion | null>(null);
  
  // Ladda användarens plattformar baserat på strategi
  useEffect(() => {
    if (brandStrategy?.platforms && brandStrategy.platforms.length > 0) {
      setSelectedPlatform(brandStrategy.platforms[0]);
      setFeedbackPlatform(brandStrategy.platforms[0]);
      setSchedulePlatform(brandStrategy.platforms[0]);
    }
  }, [brandStrategy]);
  
  // Hämta innehållsidéer
  const handleGetContentIdeas = async () => {
    if (!selectedPlatform) {
      toast({
        title: "Välj en plattform",
        description: "Du måste välja en plattform för att generera idéer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const ideas = await aiAssistantService.getContentIdeas(userId, {
        platform: selectedPlatform,
        contentType: contentType,
        count: ideasCount
      });
      
      setContentIdeas(ideas);
      
      toast({
        title: "Innehållsidéer genererade",
        description: `${ideas.length} idéer har genererats för ${selectedPlatform}.`,
      });
    } catch (error) {
      console.error("Error getting content ideas:", error);
      toast({
        title: "Ett fel inträffade",
        description: "Kunde inte generera innehållsidéer. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Få feedback på innehåll
  const handleGetContentFeedback = async () => {
    if (!contentTitle.trim() || !contentBody.trim() || !feedbackPlatform) {
      toast({
        title: "Ofullständig information",
        description: "Fyll i alla fält för att få innehållsfeedback.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const feedback = await aiAssistantService.getContentFeedback(userId, {
        title: contentTitle,
        body: contentBody,
        platform: feedbackPlatform
      });
      
      setContentFeedback(feedback);
      
      toast({
        title: "Feedback genererad",
        description: "Din innehållsfeedback är klar.",
      });
    } catch (error) {
      console.error("Error getting content feedback:", error);
      toast({
        title: "Ett fel inträffade",
        description: "Kunde inte generera feedback. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Få schemaläggningsförslag
  const handleGetScheduleSuggestions = async () => {
    if (!schedulePlatform) {
      toast({
        title: "Välj en plattform",
        description: "Du måste välja en plattform för att få schemaförslag.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const suggestions = await aiAssistantService.getSchedulingSuggestions(userId, schedulePlatform);
      
      setScheduleData(suggestions);
      
      toast({
        title: "Schemaförslag genererade",
        description: `Schemaförslag för ${schedulePlatform} är klara.`,
      });
    } catch (error) {
      console.error("Error getting scheduling suggestions:", error);
      toast({
        title: "Ett fel inträffade",
        description: "Kunde inte generera schemaförslag. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Framtida implementering: Generell chatt med AI-assistenten
  const handleSendMessage = () => {
    // Detta skulle i en verklig implementation anropa en chatbot-funktion
    toast({
      title: "Funktion under utveckling",
      description: "Direktchatt med AI kommer snart!",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          BrandSphere AI-Assistent
        </CardTitle>
        <CardDescription>
          Få personlig hjälp och förslag baserade på din varumärkesstrategi
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="ideas">
              <Lightbulb className="h-4 w-4 mr-2" />
              Innehållsidéer
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock className="h-4 w-4 mr-2" />
              Schemaförslag
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Plattform</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj plattform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Innehållstyp</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Blandat</SelectItem>
                    <SelectItem value="educational">Utbildande</SelectItem>
                    <SelectItem value="inspirational">Inspirerande</SelectItem>
                    <SelectItem value="entertainment">Underhållande</SelectItem>
                    <SelectItem value="promotional">Säljfrämjande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Antal idéer</label>
                <Select 
                  value={ideasCount.toString()} 
                  onValueChange={(value) => setIdeasCount(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj antal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 idéer</SelectItem>
                    <SelectItem value="5">5 idéer</SelectItem>
                    <SelectItem value="10">10 idéer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleGetContentIdeas}
              disabled={isLoading || !selectedPlatform}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Genererar idéer...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generera innehållsidéer
                </>
              )}
            </Button>
            
            {contentIdeas.length > 0 && (
              <div className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">Dina innehållsidéer</h3>
                
                <div className="space-y-3">
                  {contentIdeas.map((idea, index) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{idea.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {idea.format} • För {idea.targetAudience}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm">{idea.description}</p>
                        
                        <div className="mt-3">
                          <h4 className="text-xs font-medium mb-1">Nyckelpoänger:</h4>
                          <ul className="text-xs list-disc pl-4 space-y-1">
                            {idea.keyPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {idea.hashtags.map((tag, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Titel</label>
                <Input
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Ange titeln på ditt inlägg"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Plattform</label>
                <Select value={feedbackPlatform} onValueChange={setFeedbackPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj plattform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Innehåll</label>
              <Textarea
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder="Klistra in eller skriv in innehållet du vill ha feedback på..."
                className="min-h-[150px]"
              />
            </div>
            
            <Button 
              onClick={handleGetContentFeedback}
              disabled={isLoading || !contentTitle.trim() || !contentBody.trim() || !feedbackPlatform}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyserar innehåll...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Få feedback på innehåll
                </>
              )}
            </Button>
            
            {contentFeedback && (
              <div className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">Innehållsfeedback</h3>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Helhetsbetyg</CardTitle>
                      <div className="text-xl font-bold">{contentFeedback.overallScore}/10</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-col items-center p-2 border rounded-md">
                        <span className="text-muted-foreground text-xs">Varumärkesöverensstämmelse</span>
                        <span className="text-lg font-semibold">{contentFeedback.brandAlignmentScore}/10</span>
                      </div>
                      <div className="flex flex-col items-center p-2 border rounded-md">
                        <span className="text-muted-foreground text-xs">Målgruppsrelevans</span>
                        <span className="text-lg font-semibold">{contentFeedback.audienceRelevanceScore}/10</span>
                      </div>
                      <div className="flex flex-col items-center p-2 border rounded-md">
                        <span className="text-muted-foreground text-xs">Tydlighet</span>
                        <span className="text-lg font-semibold">{contentFeedback.clarityScore}/10</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Styrkor:</h4>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {contentFeedback.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Förbättringsområden:</h4>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {contentFeedback.improvements.map((improvement, i) => (
                          <li key={i}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-1">Förslag på förbättring:</h4>
                      <p className="text-sm">{contentFeedback.suggestions}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Plattform</label>
              <Select value={schedulePlatform} onValueChange={setSchedulePlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj plattform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGetScheduleSuggestions}
              disabled={isLoading || !schedulePlatform}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Genererar schemaförslag...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Få schemaläggningsförslag
                </>
              )}
            </Button>
            
            {scheduleData && (
              <div className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">Schemaläggningsförslag för {schedulePlatform}</h3>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Bästa dagar för publicering:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scheduleData.bestDays.map((day, i) => (
                            <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Bästa tider för publicering:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scheduleData.bestTimes.map((time, i) => (
                            <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Rekommenderad frekvens:</h4>
                      <div className="px-3 py-2 bg-muted rounded-md text-sm">
                        {scheduleData.recommendedFrequency}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Förklaring:</h4>
                      <p className="text-sm">{scheduleData.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex items-center">
        <div className="flex items-center w-full space-x-2">
          <Input
            placeholder="Ställ en fråga till din AI-assistent..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!userMessage.trim()}
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 
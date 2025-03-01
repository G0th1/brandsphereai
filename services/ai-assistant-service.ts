import { createClient } from '@supabase/supabase-js';
import { BrandStrategy } from './onboarding-service';

// Skapa en Supabase-klient
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// API-URL för AI-tjänsten
const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const AI_API_KEY = process.env.OPENAI_API_KEY || '';

export interface ContentSuggestion {
  title: string;
  description: string;
  format: string;
  platform: string;
  targetAudience: string;
  keyPoints: string[];
  hashtags: string[];
}

export interface ContentFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  suggestions: string;
  brandAlignmentScore: number;
  audienceRelevanceScore: number;
  clarityScore: number;
}

export interface ScheduleSuggestion {
  bestDays: string[];
  bestTimes: string[];
  recommendedFrequency: string;
  explanation: string;
}

export enum CommandType {
  ContentIdeas = "content_ideas",
  ContentFeedback = "content_feedback",
  ScheduleSuggestions = "schedule_suggestions",
  BrandVoice = "brand_voice",
  AudienceInsights = "audience_insights",
  MarketingStrategy = "marketing_strategy",
}

class AIAssistantService {
  
  async getContentIdeas(userId: string, options: {
    platform?: string;
    contentType?: string;
    count?: number;
  } = {}): Promise<ContentSuggestion[]> {
    try {
      // Hämta användarens varumärkesstrategi för personlig anpassning
      const strategy = await this.getBrandStrategy(userId);
      if (!strategy) {
        throw new Error("Användaren har ingen varumärkesstrategi");
      }
      
      // Skapa en systemmeddelande för AI:n baserat på användarens strategi
      const systemMessage = `Du är en Content Strategy AI, specialiserad på att hjälpa kreatörer med personliga varumärken.
      
      Användarens varumärkesstrategi:
      - Intention: ${strategy.intention}
      - Målgrupp: ${JSON.stringify(strategy.audience)}
      - Unik värdezon: ${JSON.stringify(strategy.uvz)}
      - Plattformar: ${strategy.platforms.join(', ')}
      
      Baserat på denna strategi, generera kreativa och engagerande innehållsidéer som:
      1. Är anpassade för målgruppen
      2. Ligger inom den unika värdezonen
      3. Är optimerade för de angivna plattformarna
      4. Är genomförbara och specifika
      
      Formatera ditt svar som ett JSON-array med innehållsförslag.`;
      
      // Skapa användarmeddelande med specifika krav
      const platform = options.platform || strategy.platforms[0] || 'instagram';
      const count = options.count || 5;
      const contentType = options.contentType || 'mixed';
      
      const userMessage = `Generera ${count} innehållsidéer för ${platform}. 
      Jag är intresserad av ${contentType} innehåll.
      Mina följare är intresserade av ${strategy.audience.interests}.
      Min unika värdezon är: ${strategy.uvz.broadCategory} > ${strategy.uvz.subCategory} > För ${strategy.uvz.specificAudience}.`;
      
      // Göra API-anrop till AI-tjänsten
      const response = await this.callAIService(CommandType.ContentIdeas, systemMessage, userMessage);
      
      // Endast för utvecklingsändamål, returnera simulerade data om AI-anropet misslyckas
      if (!response) {
        return this.getMockContentIdeas(platform, count);
      }
      
      return response as ContentSuggestion[];
    } catch (error) {
      console.error("Error getting content ideas:", error);
      // Returnera simulerad data som fallback
      return this.getMockContentIdeas(options.platform || 'instagram', options.count || 5);
    }
  }
  
  async getContentFeedback(userId: string, content: {
    title: string;
    body: string;
    platform: string;
  }): Promise<ContentFeedback> {
    try {
      // Hämta användarens varumärkesstrategi för personlig anpassning
      const strategy = await this.getBrandStrategy(userId);
      if (!strategy) {
        throw new Error("Användaren har ingen varumärkesstrategi");
      }
      
      // Skapa ett systemmeddelande för AI:n baserat på användarens strategi
      const systemMessage = `Du är en Content Feedback AI, specialiserad på att analysera och förbättra innehåll för personliga varumärken.
      
      Användarens varumärkesstrategi:
      - Intention: ${strategy.intention}
      - Målgrupp: ${JSON.stringify(strategy.audience)}
      - Unik värdezon: ${JSON.stringify(strategy.uvz)}
      - Plattformar: ${strategy.platforms.join(', ')}
      
      Analysera innehållet och ge konstruktiv feedback på:
      1. Överensstämmelse med varumärkesstrategin
      2. Relevans för målgruppen
      3. Klarhet och tydlighet i budskapet
      4. Engagemangspotential
      5. Specifika förbättringsförslag
      
      Formatera ditt svar som ett JSON-objekt med feedbackkategorier.`;
      
      // Skapa användarmeddelande med innehållet att analysera
      const userMessage = `Analysera detta innehåll för ${content.platform}:
      
      Titel: ${content.title}
      
      Innehåll:
      ${content.body}
      
      Ge mig konstruktiv feedback som jag kan använda för att förbättra innehållet.`;
      
      // Göra API-anrop till AI-tjänsten
      const response = await this.callAIService(CommandType.ContentFeedback, systemMessage, userMessage);
      
      // Endast för utvecklingsändamål, returnera simulerade data om AI-anropet misslyckas
      if (!response) {
        return this.getMockContentFeedback();
      }
      
      return response as ContentFeedback;
    } catch (error) {
      console.error("Error getting content feedback:", error);
      // Returnera simulerad data som fallback
      return this.getMockContentFeedback();
    }
  }
  
  async getSchedulingSuggestions(userId: string, platform: string): Promise<ScheduleSuggestion> {
    try {
      // Hämta användarens varumärkesstrategi för personlig anpassning
      const strategy = await this.getBrandStrategy(userId);
      if (!strategy) {
        throw new Error("Användaren har ingen varumärkesstrategi");
      }
      
      // Skapa ett systemmeddelande för AI:n baserat på användarens strategi
      const systemMessage = `Du är en Content Scheduling AI, specialiserad på att optimera publiceringstider för olika sociala medieplattformar.
      
      Användarens varumärkesstrategi:
      - Intention: ${strategy.intention}
      - Målgrupp: ${JSON.stringify(strategy.audience)}
      - Plattformar: ${strategy.platforms.join(', ')}
      
      Baserat på denna strategi och bästa praxis för sociala medier, generera schemaläggningsrekommendationer som:
      1. Specificerar de bästa dagarna för publicering
      2. Specificerar de bästa tiderna för publicering
      3. Rekommenderar optimal publiceringsfrekvens
      4. Förklarar logiken bakom rekommendationerna
      
      Formatera ditt svar som ett JSON-objekt med schemaläggningsrekommendationer.`;
      
      // Skapa användarmeddelande med specifik plattform
      const userMessage = `Ge mig rekommendationer för bästa publiceringstider och frekvens för ${platform}. 
      Min målgrupp är intresserad av ${strategy.audience.interests} och är främst i åldersgrupperna ${strategy.audience.ageRanges.join(', ')}.`;
      
      // Göra API-anrop till AI-tjänsten
      const response = await this.callAIService(CommandType.ScheduleSuggestions, systemMessage, userMessage);
      
      // Endast för utvecklingsändamål, returnera simulerade data om AI-anropet misslyckas
      if (!response) {
        return this.getMockScheduleSuggestions(platform);
      }
      
      return response as ScheduleSuggestion;
    } catch (error) {
      console.error("Error getting scheduling suggestions:", error);
      // Returnera simulerad data som fallback
      return this.getMockScheduleSuggestions(platform);
    }
  }
  
  // Anrop till AI-tjänsten (OpenAI eller annan leverantör)
  private async callAIService(
    commandType: CommandType,
    systemMessage: string,
    userMessage: string
  ): Promise<any> {
    try {
      // Här skulle vi göra ett faktiskt API-anrop till OpenAI eller annan AI-tjänst
      // För utvecklingsändamål returnerar vi bara null, så fallback-logiken används
      
      // Exempel på konfiguration för OpenAI-anrop
      const payload = {
        model: "gpt-4",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 800,
      };
      
      // I en riktig implementation skulle detta anrop göras
      // const response = await fetch(AI_API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${AI_API_KEY}`
      //   },
      //   body: JSON.stringify(payload)
      // });
      
      // const data = await response.json();
      // return JSON.parse(data.choices[0].message.content);
      
      // För utvecklingsändamål, returnera null så simulerade data används
      return null;
    } catch (error) {
      console.error("Error calling AI service:", error);
      return null;
    }
  }
  
  // Hjälpmetod för att hämta användarens strategi
  private async getBrandStrategy(userId: string): Promise<BrandStrategy | null> {
    try {
      const { data, error } = await supabase
        .from('brand_strategies')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        userId: data.user_id,
        intention: data.intention,
        audience: data.audience,
        uvz: data.uvz,
        platforms: data.platforms,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error("Error fetching brand strategy:", error);
      return null;
    }
  }
  
  // Simulerade svar för utvecklingsändamål
  private getMockContentIdeas(platform: string, count: number): ContentSuggestion[] {
    const suggestions: ContentSuggestion[] = [
      {
        title: "5 Vanliga misstag att undvika när du bygger ditt personliga varumärke",
        description: "En guide som belyser de vanligaste misstagen människor gör när de bygger sitt personliga varumärke och hur man kan undvika dem.",
        format: "Carousel",
        platform: platform,
        targetAudience: "Nybörjare inom personlig varumärkesbyggande",
        keyPoints: [
          "Inkonsekvens i kommunikation",
          "Att inte definiera din målgrupp",
          "Försöka tilltala alla",
          "Kopiera andras stil",
          "Underskatta engagemang med följare"
        ],
        hashtags: ["#PersonligtVarumärke", "#PersonalBranding", "#Karriärtips", "#Framgång"]
      },
      {
        title: "Så skapar du innehåll som engagerar din målgrupp",
        description: "En praktisk guide för att skapa innehåll som verkligen resonerar med din specifika målgrupp och ökar engagemanget.",
        format: "Video",
        platform: platform,
        targetAudience: "Content creators och influencers",
        keyPoints: [
          "Förstå din målgrupps behov",
          "Berätta personliga historier",
          "Skapa värde genom utbildning",
          "Använda rätt innehållsformat",
          "Engagera dig i kommentarer"
        ],
        hashtags: ["#ContentCreation", "#Engagemang", "#SocialMediaTips", "#Målgrupp"]
      },
      {
        title: "Min dagliga rutin för produktivitet och kreativitet",
        description: "Dela din personliga morgon- och arbetsrutin som hjälper dig att maximera kreativitet och produktivitet.",
        format: "Story",
        platform: platform,
        targetAudience: "Entreprenörer och kreativa yrkesverksamma",
        keyPoints: [
          "Morgonrutiner för fokus",
          "Strukturering av arbetsdagen",
          "Kreativa pauser och hur de används",
          "Verktyg för produktivitet",
          "Kvällsrutin för reflektion"
        ],
        hashtags: ["#Produktivitet", "#Kreativitet", "#MorgonRutin", "#Entreprenör"]
      },
      {
        title: "Bakom kulisserna: Så här skapar jag mitt innehåll",
        description: "Ge dina följare en inblick i din process för att skapa innehåll, från idé till publicering.",
        format: "Reels",
        platform: platform,
        targetAudience: "Aspirerande innehållsskapare",
        keyPoints: [
          "Idégenerering och planering",
          "Utrustning och verktyg",
          "Filmnings- eller skrivprocess",
          "Redigering och finslipning",
          "Optimering för plattformen"
        ],
        hashtags: ["#BehindTheScenes", "#ContentCreator", "#CreativeProcess", "#Inspiration"]
      },
      {
        title: "Intervju med [Expert inom din nisch]: Insikter och tips",
        description: "En intervju med en respekterad expert inom din nisch som delar värdefulla insikter och tips för din målgrupp.",
        format: "Live",
        platform: platform,
        targetAudience: "Alla följare intresserade av din nisch",
        keyPoints: [
          "Expertens bakgrund och erfarenhet",
          "De största utmaningarna i branschen",
          "Praktiska tips för framgång",
          "Framtidstrender att hålla ögonen på",
          "Resurser och rekommendationer"
        ],
        hashtags: ["#Expertintervju", "#BranschInsikter", "#Livesamtal", "#Professionellutveckling"]
      }
    ];
    
    return suggestions.slice(0, count);
  }
  
  private getMockContentFeedback(): ContentFeedback {
    return {
      overallScore: 7.5,
      strengths: [
        "Tydligt budskap med värdefull information",
        "Bra användning av personlig erfarenhet",
        "Relevant för din definierade målgrupp",
        "Engagerande inledning som fångar uppmärksamhet"
      ],
      improvements: [
        "Avslutningen kunde vara starkare med en tydligare CTA",
        "Fler konkreta exempel skulle stärka dina poänger",
        "Språket kunde vara mer konsekvent med din varumärkesröst",
        "Överväg att inkludera mer visuella element för att förbättra engagemanget"
      ],
      suggestions: "Prova att omstrukturera innehållet med den viktigaste informationen först. Lägg till en personlig anekdot i mitten för att öka relaterbarhet. Avsluta med en stark uppmaning till handling som uppmuntrar diskussion.",
      brandAlignmentScore: 8.2,
      audienceRelevanceScore: 7.8,
      clarityScore: 6.9
    };
  }
  
  private getMockScheduleSuggestions(platform: string): ScheduleSuggestion {
    const platformData = {
      'instagram': {
        bestDays: ["Måndag", "Onsdag", "Fredag"],
        bestTimes: ["12:00-13:00", "17:00-19:00", "21:00-22:00"],
        recommendedFrequency: "3-4 gånger per vecka",
        explanation: "Instagram har högst engagemang under lunchpausen, strax efter arbetstid, och på kvällen. Måndagar och onsdagar har visat sig vara särskilt effektiva för professionellt innehåll, medan fredagar är bra för mer lättsamt material."
      },
      'linkedin': {
        bestDays: ["Tisdag", "Onsdag", "Torsdag"],
        bestTimes: ["08:00-09:00", "12:00-13:00", "17:00-18:00"],
        recommendedFrequency: "2-3 gånger per vecka",
        explanation: "LinkedIn är en professionell plattform där användare är mest aktiva under arbetsveckan, särskilt tisdag till torsdag. Morgnar, lunchtid och sen eftermiddag är optimala tider när yrkesverksamma kollar sina flöden."
      },
      'youtube': {
        bestDays: ["Lördag", "Söndag", "Torsdag"],
        bestTimes: ["15:00-16:00", "18:00-21:00"],
        recommendedFrequency: "1-2 gånger per vecka",
        explanation: "YouTube har högst tittarantal under helger och kvällar. Torsdagskvällar har också visat hög aktivitet. För din innehållstyp rekommenderas en konsekvent veckovis eller varannan vecka publiceringsschema för att bygga en lojal följarbas."
      },
      'twitter': {
        bestDays: ["Måndag", "Onsdag", "Fredag"],
        bestTimes: ["08:00-10:00", "12:00-13:00", "18:00-19:00"],
        recommendedFrequency: "4-5 gånger per vecka",
        explanation: "Twitter är en plattform med snabb omsättning där innehåll har kort livslängd. Morgnar är bra för branschnyheter, lunchtid för engagerande innehåll, och kvällar för diskussioner. Högre frekvens rekommenderas på grund av plattformens natur."
      }
    };
    
    // Default till Instagram om plattformen inte finns med
    return platformData[platform.toLowerCase()] || platformData['instagram'];
  }
}

export const aiAssistantService = new AIAssistantService(); 
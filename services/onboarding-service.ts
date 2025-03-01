import { createClient } from '@supabase/supabase-js';

// Skapa en Supabase-klient
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface BrandStrategy {
  id?: string;
  userId: string;
  intention: string;
  audience: {
    ageRanges: string[];
    interests: string;
    pains: string;
  };
  uvz: {
    broadCategory: string;
    subCategory: string;
    specificAudience: string;
  };
  platforms: string[];
  createdAt?: string;
  updatedAt?: string;
}

class OnboardingService {
  async saveBrandStrategy(strategy: BrandStrategy): Promise<BrandStrategy | null> {
    try {
      // Kontrollera om användaren redan har en strategi
      const { data: existingData } = await supabase
        .from('brand_strategies')
        .select('*')
        .eq('user_id', strategy.userId)
        .single();
      
      if (existingData) {
        // Uppdatera existerande strategi
        const { data, error } = await supabase
          .from('brand_strategies')
          .update({
            intention: strategy.intention,
            audience: strategy.audience,
            uvz: strategy.uvz,
            platforms: strategy.platforms,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', strategy.userId)
          .select()
          .single();
        
        if (error) throw error;
        
        return this.mapStrategyFromDb(data);
      } else {
        // Skapa ny strategi
        const { data, error } = await supabase
          .from('brand_strategies')
          .insert([{
            user_id: strategy.userId,
            intention: strategy.intention,
            audience: strategy.audience,
            uvz: strategy.uvz,
            platforms: strategy.platforms
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        return this.mapStrategyFromDb(data);
      }
    } catch (error) {
      console.error('Error saving brand strategy:', error);
      return null;
    }
  }
  
  async getBrandStrategy(userId: string): Promise<BrandStrategy | null> {
    try {
      const { data, error } = await supabase
        .from('brand_strategies')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return data ? this.mapStrategyFromDb(data) : null;
    } catch (error) {
      console.error('Error getting brand strategy:', error);
      return null;
    }
  }
  
  async deleteBrandStrategy(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('brand_strategies')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting brand strategy:', error);
      return false;
    }
  }
  
  private mapStrategyFromDb(data: any): BrandStrategy {
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
  }
}

export const onboardingService = new OnboardingService(); 
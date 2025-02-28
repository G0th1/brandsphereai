// Importera Supabase-klienten
import { createClient } from '@supabase/supabase-js';

// Skapa en Supabase-klient
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ContentSuggestion {
  id?: string;
  title: string;
  content: string;
  platform: 'facebook' | 'youtube';
  contentType: 'post' | 'video';
  createdAt?: string;
}

export interface ScheduledPost {
  id?: string;
  title: string;
  content: string;
  platform: 'facebook' | 'youtube';
  contentType: 'post' | 'video';
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'failed';
  createdAt?: string;
}

class ContentService {
  async createContentSuggestion(suggestion: ContentSuggestion): Promise<ContentSuggestion | null> {
    try {
      const { data, error } = await supabase
        .from('content_suggestions')
        .insert([
          { 
            title: suggestion.title,
            content: suggestion.content,
            platform: suggestion.platform,
            content_type: suggestion.contentType
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? {
        id: data.id,
        title: data.title,
        content: data.content,
        platform: data.platform,
        contentType: data.content_type,
        createdAt: data.created_at
      } : null;
    } catch (error) {
      console.error('Error creating content suggestion:', error);
      return null;
    }
  }
  
  async schedulePost(post: ScheduledPost): Promise<ScheduledPost | null> {
    try {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert([
          { 
            title: post.title,
            content: post.content,
            platform: post.platform,
            content_type: post.contentType,
            scheduled_for: post.scheduledFor,
            status: post.status
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? {
        id: data.id,
        title: data.title,
        content: data.content,
        platform: data.platform,
        contentType: data.content_type,
        scheduledFor: data.scheduled_for,
        status: data.status,
        createdAt: data.created_at
      } : null;
    } catch (error) {
      console.error('Error scheduling post:', error);
      return null;
    }
  }
}

export const contentService = new ContentService(); 
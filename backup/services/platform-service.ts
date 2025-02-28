import { supabase } from '@/lib/supabase'

export type PlatformConnection = {
  id: string
  platform: 'google' | 'facebook'
  platformUserId: string
  accessToken: string
  refreshToken: string
}

export type ContentSuggestion = {
  id: string
  title: string
  content: string
  platform: 'youtube' | 'facebook'
  status: 'pending' | 'approved' | 'rejected'
}

export type ScheduledPost = {
  id: string
  platform: 'youtube' | 'facebook'
  content: string
  scheduledFor: Date
  status: 'scheduled' | 'published' | 'failed'
}

class PlatformService {
  // Hämta användarens plattformsanslutningar
  async getUserConnections(userId: string): Promise<PlatformConnection[]> {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  // Spara en ny plattformsanslutning
  async saveConnection(userId: string, connection: Omit<PlatformConnection, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: userId,
        platform: connection.platform,
        platform_user_id: connection.platformUserId,
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken,
      })

    if (error) throw error
  }

  // Hämta innehållsförslag för en användare
  async getContentSuggestions(userId: string): Promise<ContentSuggestion[]> {
    const { data, error } = await supabase
      .from('content_suggestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Skapa ett nytt innehållsförslag
  async createContentSuggestion(
    userId: string,
    suggestion: Omit<ContentSuggestion, 'id' | 'status'>
  ): Promise<ContentSuggestion> {
    const { data, error } = await supabase
      .from('content_suggestions')
      .insert({
        user_id: userId,
        title: suggestion.title,
        content: suggestion.content,
        platform: suggestion.platform,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Uppdatera status för ett innehållsförslag
  async updateSuggestionStatus(
    userId: string,
    suggestionId: string,
    status: ContentSuggestion['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('content_suggestions')
      .update({ status })
      .match({ id: suggestionId, user_id: userId })

    if (error) throw error
  }

  // Schemalägg ett inlägg
  async schedulePost(
    userId: string,
    post: Omit<ScheduledPost, 'id' | 'status'>,
    suggestionId?: string
  ): Promise<ScheduledPost> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id: userId,
        content_suggestion_id: suggestionId,
        platform: post.platform,
        content: post.content,
        scheduled_for: post.scheduledFor.toISOString(),
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Hämta schemalagda inlägg
  async getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_for', { ascending: true })

    if (error) throw error
    return data
  }
}

export const platformService = new PlatformService() 
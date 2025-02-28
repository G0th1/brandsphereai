import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface PlatformConnection {
  platform: 'youtube' | 'facebook'
  accessToken: string
  refreshToken: string
  platformUserId: string
}

class PlatformService {
  async saveConnection(connection: PlatformConnection) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Ingen användare inloggad')

    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: user.id,
        platform: connection.platform,
        platform_user_id: connection.platformUserId,
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
  }

  async getConnection(platform: 'youtube' | 'facebook') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Ingen användare inloggad')

    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single()

    if (error) throw error
    return data
  }

  async deleteConnection(platform: 'youtube' | 'facebook') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Ingen användare inloggad')

    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('user_id', user.id)
      .eq('platform', platform)

    if (error) throw error
  }
}

export const platformService = new PlatformService() 
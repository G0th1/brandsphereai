import { platformService } from './platform-service'

export type FacebookPage = {
  id: string
  name: string
  category: string
  followerCount: number
  picture: string
}

export type FacebookPost = {
  id: string
  message: string
  createdTime: Date
  type: string
  reactions: number
  comments: number
  shares: number
}

class FacebookService {
  private async getAccessToken(userId: string): Promise<string> {
    const connections = await platformService.getUserConnections(userId)
    const facebookConnection = connections.find(c => c.platform === 'facebook')
    if (!facebookConnection) {
      throw new Error('Ingen Facebook-anslutning hittad')
    }
    return facebookConnection.accessToken
  }

  // Hämta användarens Facebook-sidor
  async getPages(userId: string): Promise<FacebookPage[]> {
    const accessToken = await this.getAccessToken(userId)
    const response = await fetch(
      'https://graph.facebook.com/v18.0/me/accounts?fields=id,name,category,followers_count,picture',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Kunde inte hämta Facebook-sidor')
    }

    const data = await response.json()
    return data.data.map((page: any) => ({
      id: page.id,
      name: page.name,
      category: page.category,
      followerCount: page.followers_count,
      picture: page.picture.data.url,
    }))
  }

  // Hämta inlägg för en specifik sida
  async getPosts(userId: string, pageId: string): Promise<FacebookPost[]> {
    const accessToken = await this.getAccessToken(userId)
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,type,reactions.summary(total_count),comments.summary(total_count),shares`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Kunde inte hämta Facebook-inlägg')
    }

    const data = await response.json()
    return data.data.map((post: any) => ({
      id: post.id,
      message: post.message || '',
      createdTime: new Date(post.created_time),
      type: post.type,
      reactions: post.reactions?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
    }))
  }

  // Schemalägg ett nytt inlägg
  async schedulePost(
    userId: string,
    pageId: string,
    message: string,
    scheduledFor: Date
  ): Promise<void> {
    await platformService.schedulePost(userId, {
      platform: 'facebook',
      content: JSON.stringify({ pageId, message }),
      scheduledFor,
    })
  }
}

export const facebookService = new FacebookService() 
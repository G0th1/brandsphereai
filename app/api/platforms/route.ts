import { NextResponse } from 'next/server'
import { platformService } from '@/lib/services/platform-service'
import { youtubeService } from '@/lib/services/youtube-service'
import { facebookService } from '@/lib/services/facebook-service'
import { getUser } from '@/lib/auth'

// Konfigurera rutten som dynamisk
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const connections = await platformService.getUserConnections(user.id)
    const platforms = []

    // Hämta YouTube-data om ansluten
    if (connections.some(c => c.platform === 'google')) {
      try {
        const channel = await youtubeService.getChannel(user.id)
        const videos = await youtubeService.getVideos(user.id, 5)
        platforms.push({
          platform: 'youtube',
          channel,
          recentContent: videos,
        })
      } catch (error) {
        console.error('Fel vid hämtning av YouTube-data:', error)
      }
    }

    // Hämta Facebook-data om ansluten
    if (connections.some(c => c.platform === 'facebook')) {
      try {
        const pages = await facebookService.getPages(user.id)
        const recentPosts = []
        for (const page of pages.slice(0, 3)) { // Begränsa till 3 sidor för prestanda
          const posts = await facebookService.getPosts(user.id, page.id)
          recentPosts.push(...posts)
        }
        platforms.push({
          platform: 'facebook',
          pages,
          recentContent: recentPosts.sort((a, b) => b.createdTime.getTime() - a.createdTime.getTime()).slice(0, 5),
        })
      } catch (error) {
        console.error('Fel vid hämtning av Facebook-data:', error)
      }
    }

    return NextResponse.json({ platforms })
  } catch (error) {
    console.error('Fel vid hämtning av plattformsdata:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 
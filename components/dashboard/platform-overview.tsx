'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, MessageSquare, ThumbsUp, Users } from 'lucide-react'

type PlatformOverviewProps = {
  platform: {
    platform: 'youtube' | 'facebook'
    channel?: {
      title: string
      subscriberCount: number
      videoCount: number
      viewCount: number
    }
    pages?: Array<{
      id: string
      name: string
      category: string
      followerCount: number
      picture: string
    }>
    recentContent: Array<any>
  }
}

export function PlatformOverview({ platform }: PlatformOverviewProps) {
  if (platform.platform === 'youtube') {
    return (
      <div className="space-y-6">
        {/* Kanalstatistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Prenumeranter</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platform.channel?.subscriberCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Videor</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platform.channel?.videoCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Visningar</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platform.channel?.viewCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Senaste videor */}
        <Card>
          <CardHeader>
            <CardTitle>Senaste videor</CardTitle>
            <CardDescription>Dina senast uppladdade videor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platform.recentContent.map((video: any) => (
                <div key={video.id} className="flex items-start space-x-4">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-48 h-27 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        {video.viewCount.toLocaleString()} visningar
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {video.likeCount.toLocaleString()} gillar
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {video.commentCount.toLocaleString()} kommentarer
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Facebook-sidor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platform.pages?.map((page) => (
          <Card key={page.id}>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <img
                src={page.picture}
                alt={page.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <CardTitle className="text-lg">{page.name}</CardTitle>
                <CardDescription>{page.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {page.followerCount.toLocaleString()} följare
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Senaste inlägg */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste inlägg</CardTitle>
          <CardDescription>Dina senaste Facebook-inlägg</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platform.recentContent.map((post: any) => (
              <div key={post.id} className="p-4 border rounded-lg">
                <p className="whitespace-pre-wrap">{post.message}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {post.reactions.toLocaleString()} reaktioner
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {post.comments.toLocaleString()} kommentarer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
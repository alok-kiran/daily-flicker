'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PostImage } from '@/components/post-image'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, MessageCircle } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  thumbnail?: string | null
  createdAt: Date
  author: {
    name?: string | null
    image?: string | null
  }
  category?: {
    id: string
    name: string
    slug: string
    color: string
  } | null
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
  _count?: {
    comments: number
  }
}

interface TrendingNewsSectionProps {
  posts: Post[]
}

export function TrendingNewsSection({ posts }: TrendingNewsSectionProps) {
  if (!posts || posts.length === 0) return null

  const mainPost = posts[0]
  const sidebarPosts = posts.slice(1, 5) // Show up to 4 sidebar posts

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-red-500" />
          <h2 className="text-3xl font-bold text-foreground">Trending News</h2>
        </div>
        <div className="ml-4 h-0.5 bg-gradient-to-r from-red-500 to-transparent flex-1"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Post */}
        <div className="lg:col-span-2">
          <Link href={`/posts/${mainPost.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[16/10] shadow-xl">
              {mainPost.thumbnail && (
                <PostImage
                  src={mainPost.thumbnail}
                  alt={mainPost.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center space-x-4 mb-4">
                  {mainPost.category && (
                    <Badge 
                      variant="secondary" 
                      className="text-white font-medium px-3 py-1.5 text-sm rounded-full"
                      style={{ backgroundColor: mainPost.category.color }}
                    >
                      {mainPost.category.name}
                    </Badge>
                  )}
                  <div className="flex items-center text-white/80 text-sm">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {formatDate(mainPost.createdAt)}
                  </div>
                </div>
                
                <h3 className="text-white text-xl lg:text-3xl font-bold mb-3 leading-tight group-hover:text-gray-200 transition-colors line-clamp-2">
                  {mainPost.title}
                </h3>
                
                <p className="text-white/90 text-base leading-relaxed line-clamp-3 mb-4">
                  {mainPost.excerpt || 
                    `${mainPost.content.replace(/<[^>]*>/g, '').substring(0, 120)}...`
                  }
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/70 text-sm">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    {mainPost._count?.comments || 0} comments
                  </div>
                  <span className="text-red-400 font-medium text-sm group-hover:text-red-300 transition-colors">
                    Read More →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Sidebar Posts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
              More Trending
            </h3>
            
            <div className="space-y-4">
              {sidebarPosts.map((post, index) => (
                <Link 
                  key={post.id} 
                  href={`/posts/${post.slug}`} 
                  className="group block"
                >
                  <article className="flex space-x-4 p-3 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white text-sm font-bold rounded-full">
                        {index + 2}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 dark:text-white font-semibold text-sm leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h4>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                        <time className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(post.createdAt)}
                        </time>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {post._count?.comments || 0}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                         <p className="text-red-50 text-sm mb-4">
               Don&apos;t miss out on the latest trending stories and breaking news.
             </p>
            <Link 
              href="/posts?category=trending" 
              className="inline-flex items-center bg-white text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              View All Trending
              <TrendingUp className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
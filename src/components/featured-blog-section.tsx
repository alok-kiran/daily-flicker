'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PostImage } from '@/components/post-image'
import { Badge } from '@/components/ui/badge'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

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

interface FeaturedBlogSectionProps {
  posts: Post[]
}

export function FeaturedBlogSection({ posts }: FeaturedBlogSectionProps) {
  if (!posts || posts.length === 0) return null

  const featuredPost = posts[0]
  const otherPosts = posts.slice(1, 4) // Get next 3 posts
  const allPosts = [featuredPost, ...otherPosts] // All posts for mobile carousel

  const renderPostCard = (post: Post, isLarge = false) => (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl bg-gray-900 h-full">
        {post.thumbnail && (
          <PostImage
            src={post.thumbnail}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content overlay */}
        <div className={`absolute bottom-0 left-0 right-0 ${isLarge ? 'p-6' : 'p-4'}`}>
          {post.category && (
            <Badge 
              variant="secondary" 
              className={`mb-2 text-white rounded-md ${isLarge ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs'}`}
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Badge>
          )}
          
          <time className={`text-white/80 mb-2 block flex items-center ${isLarge ? 'text-sm' : 'text-xs'}`}>
            <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8"/>
            </svg>
            {formatDate(post.createdAt)}
          </time>
          
          <h3 className={`text-white font-bold leading-tight group-hover:text-gray-200 transition-colors line-clamp-2 ${
            isLarge ? 'text-xl sm:text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>
          
          {isLarge && (
            <p className="text-white/90 text-sm leading-relaxed line-clamp-2 mt-2">
              {post.excerpt || 
                `${post.content.replace(/<[^>]*>/g, '').substring(0, 80)}...`
              }
            </p>
          )}
        </div>
      </div>
    </Link>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mobile Carousel */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
          }}
          loop={true}
          className="mobile-featured-carousel"
        >
          {allPosts.map((post) => (
            <SwiperSlide key={post.id}>
              <div className="aspect-[4/3]">
                {renderPostCard(post, true)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8">
        {/* Large Featured Post */}
        <div className="lg:col-span-1">
          <Link href={`/posts/${featuredPost.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/3]">
              {featuredPost.thumbnail && (
                <PostImage
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                {featuredPost.category && (
                  <Badge 
                    variant="secondary" 
                    className="mb-2 sm:mb-3 lg:mb-4 text-white rounded-md px-2 py-1 sm:px-3 text-xs sm:text-sm"
                    style={{ backgroundColor: featuredPost.category.color }}
                  >
                    {featuredPost.category.name}
                  </Badge>
                )}
                
                <time className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 block">
                  {formatDate(featuredPost.createdAt)}
                </time>
                
                <h2 className="text-white text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight group-hover:text-gray-200 transition-colors line-clamp-2 sm:line-clamp-3">
                  {featuredPost.title}
                </h2>
                
                <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {featuredPost.excerpt || 
                    `${featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 80)}...`
                  }
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Right column with height matching left column */}
        <div className="flex flex-col h-full">
          {/* Top post - Takes up about 60% of the height */}
          {otherPosts[0] && (
            <Link href={`/posts/${otherPosts[0].slug}`} className="group block flex-[3]">
              <div className="relative overflow-hidden rounded-xl bg-gray-900 h-full">
                {otherPosts[0].thumbnail && (
                  <PostImage
                    src={otherPosts[0].thumbnail}
                    alt={otherPosts[0].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  {otherPosts[0].category && (
                    <Badge 
                      variant="secondary" 
                      className="mb-2 text-white rounded-md px-3 py-1 text-sm"
                      style={{ backgroundColor: otherPosts[0].category.color }}
                    >
                      {otherPosts[0].category.name}
                    </Badge>
                  )}
                  
                  <time className="text-white/80 text-sm mb-2 block flex items-center">
                    <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8"/>
                    </svg>
                    {formatDate(otherPosts[0].createdAt)}
                  </time>
                  
                  <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight group-hover:text-gray-200 transition-colors line-clamp-2">
                    {otherPosts[0].title}
                  </h3>
                </div>
              </div>
            </Link>
          )}
          
          {/* Gap between posts */}
          <div className="h-4"></div>
          
          {/* Bottom row - Takes up about 40% of the height, two posts side by side */}
          <div className="grid grid-cols-2 gap-4 flex-[2]">
            {otherPosts.slice(1, 3).map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-xl bg-gray-900 h-full">
                  {post.thumbnail && (
                    <PostImage
                      src={post.thumbnail}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-[1px]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    {post.category && (
                      <Badge 
                        variant="secondary" 
                        className="mb-2 text-white rounded-md px-2 py-1 text-xs"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                    
                    <time className="text-white/80 text-xs mb-2 block flex items-center">
                      <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8"/>
                      </svg>
                      {formatDate(post.createdAt)}
                    </time>
                    
                    <h3 className="text-white text-sm sm:text-base font-semibold leading-tight group-hover:text-gray-200 transition-colors line-clamp-3">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
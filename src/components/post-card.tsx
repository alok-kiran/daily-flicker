import Link from 'next/link'
import Image from 'next/image'
import { formatDate, truncateText } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface PostCardProps {
  post: {
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
    tags?: Array<{
      id: string
      name: string
      slug: string
    }>
    _count?: {
      comments: number
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const excerpt = post.excerpt || truncateText(post.content.replace(/<[^>]*>/g, ''), 150)
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.thumbnail && (
        <div className="relative h-48 w-full">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          {post.author.image && (
            <img
              src={post.author.image}
              alt={post.author.name || 'Author'}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span>{post.author.name}</span>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
        </div>
        
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/posts?tag=${tag.slug}`}
                className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {post._count && (
              <span className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post._count.comments}</span>
              </span>
            )}
            
            <Link 
              href={`/posts/${post.slug}`}
              className="text-primary hover:underline"
            >
              Read more
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
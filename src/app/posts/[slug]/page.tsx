import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layout/layout'
import { formatDate } from '@/lib/utils'
import { PostImage } from '@/components/post-image'
import { AvatarImage } from '@/components/avatar-image'
import { CommentForm } from '@/components/comment-form'
import { PostContent } from '@/components/post-content'
import Link from 'next/link'

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug,
        published: true 
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
          }
        },
        tags: true,
        comments: {
          where: { approved: true },
          include: {
            author: {
              select: {
                name: true,
                image: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            comments: { where: { approved: true } }
          }
        }
      }
    })

    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Post Header */}
        <header className="mb-8">
          {post.thumbnail && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
              <PostImage
                src={post.thumbnail}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/posts?tag=${tag.slug}`}
                  className="inline-block px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center space-x-4 pt-4">
              {post.author.image && (
                <AvatarImage
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {post.author.name}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                  <span>•</span>
                  <span>{post._count.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="mb-12">
          <PostContent content={post.content} />
        </div>

        {/* Comments Section */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">
            Comments ({post._count.comments})
          </h2>
          
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  {comment.author?.image && (
                    <AvatarImage
                      src={comment.author.image}
                      alt={comment.author.name || 'Commenter'}
                      className="h-10 w-10 rounded-full flex-shrink-0 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-foreground">
                          {comment.author?.name || 'Anonymous'}
                        </span>
                        <time 
                          dateTime={comment.createdAt.toISOString()}
                          className="text-sm text-muted-foreground"
                        >
                          {formatDate(comment.createdAt)}
                        </time>
                      </div>
                      <p className="text-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          )}
          
          {/* Comment Form */}
          <CommentForm postId={post.id} />
        </section>
      </article>
    </Layout>
  )
} 
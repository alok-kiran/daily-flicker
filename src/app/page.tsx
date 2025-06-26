import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layout/layout'
import { PostCard } from '@/components/post-card'

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        },
        tags: true,
        _count: {
          select: {
            comments: {
              where: {
                approved: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 12
    })

    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to {process.env.NEXT_PUBLIC_APP_NAME || 'Your Blog'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing stories, insights, and ideas from our community of writers.
          </p>
        </div>

        {/* Featured Posts */}
        {posts.length > 0 ? (
          <div>
            {/* Latest Post - Hero Style */}
            {posts[0] && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Latest Post</h2>
                <PostCard post={posts[0]} />
              </div>
            )}

            {/* Other Posts Grid */}
            {posts.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(1).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* View All Posts Link */}
            <div className="text-center mt-12">
              <a
                href="/posts"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                View All Posts
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              No posts yet
            </h2>
            <p className="text-muted-foreground">
              Check back soon for our first posts!
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

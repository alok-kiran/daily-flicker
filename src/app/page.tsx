import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layout/layout'
import { PostCard } from '@/components/post-card'
import { FeaturedBlogSection } from '@/components/featured-blog-section'
import { TrendingNewsSection } from '@/components/trending-news-section'

async function getPosts() {
  try {
    // Get featured posts first, then recent posts
    const [featuredPosts, recentPosts] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          category: {
            slug: 'featured'
          }
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            }
          },
          category: true,
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
        take: 8
      }),
      prisma.post.findMany({
        where: {
          published: true,
          category: {
            slug: {
              not: 'featured'
            }
          }
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            }
          },
          category: true,
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
        take: 8
      })
    ])

    // Combine featured posts first, then recent posts
    const posts = [...featuredPosts, ...recentPosts].slice(0, 12)
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getTrendingPosts() {
  try {
    const trendingPosts = await prisma.post.findMany({
      where: {
        published: true,
        category: {
          slug: 'trending'
        }
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        },
        category: true,
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
      take: 6
    })

    return trendingPosts
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return []
  }
}

export default async function HomePage() {
  const [posts, trendingPosts] = await Promise.all([
    getPosts(),
    getTrendingPosts()
  ])

  return (
    <Layout>
      {/* Featured Blog Section - Right after navbar */}
      {posts.length > 0 && <FeaturedBlogSection posts={posts} />}
      
      {/* Trending News Section */}
      {trendingPosts.length > 0 && <TrendingNewsSection posts={trendingPosts} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Posts */}
        {posts.length > 4 ? (
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-6">More Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(4).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              No posts yet
            </h2>
            <p className="text-muted-foreground">
              Check back soon for our first posts!
            </p>
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

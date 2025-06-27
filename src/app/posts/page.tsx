import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layout/layout'
import { PostCard } from '@/components/post-card'
import Link from 'next/link'

interface SearchParams {
  page?: string
  tag?: string
  category?: string
  search?: string
}

async function getPosts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {
    published: true
  }

  if (searchParams.tag) {
    where.tags = {
      some: {
        slug: searchParams.tag
      }
    }
  }

  if (searchParams.category) {
    where.category = {
      slug: searchParams.category
    }
  }

  if (searchParams.search) {
    where.OR = [
      {
        title: {
          contains: searchParams.search,
          mode: 'insensitive'
        }
      },
      {
        content: {
          contains: searchParams.search,
          mode: 'insensitive'
        }
      }
    ]
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.post.count({ where })
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      posts: [],
      pagination: { page: 1, limit, total: 0, pages: 0 }
    }
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const { posts, pagination } = await getPosts(resolvedSearchParams)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {resolvedSearchParams.category ? `${resolvedSearchParams.category.charAt(0).toUpperCase() + resolvedSearchParams.category.slice(1)} Posts` :
             resolvedSearchParams.tag ? `Posts tagged with "${resolvedSearchParams.tag}"` : 
             resolvedSearchParams.search ? `Search results for "${resolvedSearchParams.search}"` : 
             'All Posts'}
          </h1>
          <p className="text-muted-foreground">
            {pagination.total > 0 ? (
              `Showing ${posts.length} of ${pagination.total} posts`
            ) : (
              'No posts found'
            )}
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                {pagination.page > 1 && (
                  <Link
                    href={`/posts?page=${pagination.page - 1}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ''}${resolvedSearchParams.tag ? `&tag=${resolvedSearchParams.tag}` : ''}${resolvedSearchParams.search ? `&search=${resolvedSearchParams.search}` : ''}`}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Previous
                  </Link>
                )}

                <span className="text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>

                {pagination.page < pagination.pages && (
                  <Link
                    href={`/posts?page=${pagination.page + 1}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ''}${resolvedSearchParams.tag ? `&tag=${resolvedSearchParams.tag}` : ''}${resolvedSearchParams.search ? `&search=${resolvedSearchParams.search}` : ''}`}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              No posts found
            </h2>
            <p className="text-muted-foreground">
              Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
} 
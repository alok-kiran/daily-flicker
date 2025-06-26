import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// GET - Fetch posts with pagination and filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const published = searchParams.get('published')
  const authorId = searchParams.get('authorId')
  const tag = searchParams.get('tag')
  
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  
  if (published === 'true') {
    where.published = true
  }
  
  if (authorId) {
    where.authorId = authorId
  }
  
  if (tag) {
    where.tags = {
      some: {
        slug: tag
      }
    }
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          tags: true,
          _count: {
            select: {
              comments: true
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

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['admin', 'author'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)
    
    const slug = generateSlug(validatedData.title)
    
    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })
    
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      )
    }

    // Handle tags
    const tagIds = []
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagName of validatedData.tags) {
        const tagSlug = generateSlug(tagName)
        
        // Create tag if it doesn't exist
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug,
            postIds: []
          }
        })
        
        tagIds.push(tag.id)
      }
    }

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        published: validatedData.published,
        featured: validatedData.featured,
        thumbnail: validatedData.thumbnail,
        authorId: session.user.id,
        publishedAt: validatedData.published ? new Date() : null,
        tagIds
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        tags: true,
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 
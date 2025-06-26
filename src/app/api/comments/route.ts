import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string(),
})

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  const approved = searchParams.get('approved')
  
  if (!postId) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    const where: Record<string, unknown> = { postId }
    
    if (approved === 'true') {
      where.approved = true
    } else if (approved === 'false') {
      where.approved = false
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required to comment' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createCommentSchema.parse(body)

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
      select: { id: true, published: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (!post.published) {
      return NextResponse.json(
        { error: 'Cannot comment on unpublished post' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postId: validatedData.postId,
        authorId: session.user.id,
        approved: false, // Comments need approval by default
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all comments for admin moderation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // 'pending', 'approved', 'all'
    
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    
    if (status === 'pending') {
      where.approved = false
    } else if (status === 'approved') {
      where.approved = true
    }
    // If status is 'all' or not specified, don't filter by approved status

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
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
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where })
    ])

    // Get counts for different statuses
    const [pendingCount, approvedCount, totalCount] = await Promise.all([
      prisma.comment.count({ where: { approved: false } }),
      prisma.comment.count({ where: { approved: true } }),
      prisma.comment.count()
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        pending: pendingCount,
        approved: approvedCount,
        total: totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching admin comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
} 
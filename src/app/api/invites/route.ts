import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInviteCode } from '@/lib/utils'
import { sendInviteEmail } from '@/lib/email'
import { z } from 'zod'

const createInviteSchema = z.object({
  email: z.string().email(),
})

// GET - Fetch all invites (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const invites = await prisma.invite.findMany({
      include: {
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(invites)
  } catch (error) {
    console.error('Error fetching invites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    )
  }
}

// POST - Create new invite (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createInviteSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if there's already a pending invite for this email
    const existingInvite = await prisma.invite.findFirst({
      where: {
        email: validatedData.email,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Pending invite already exists for this email' },
        { status: 400 }
      )
    }

    const inviteCode = generateInviteCode()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    const invite = await prisma.invite.create({
      data: {
        email: validatedData.email,
        code: inviteCode,
        expiresAt,
        invitedById: session.user.id,
      },
      include: {
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // Send invitation email
    const emailResult = await sendInviteEmail(
      validatedData.email,
      inviteCode,
      session.user.name || 'Admin'
    )

    if (!emailResult.success) {
      // Delete the invite if email failed to send
      await prisma.invite.delete({ where: { id: invite.id } })
      
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      )
    }

    return NextResponse.json(invite, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating invite:', error)
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    )
  }
} 
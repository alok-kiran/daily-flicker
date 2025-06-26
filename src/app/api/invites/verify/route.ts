import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const verifyInviteSchema = z.object({
  code: z.string(),
  email: z.string().email(),
})

// POST - Verify and use invite code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = verifyInviteSchema.parse(body)

    const invite = await prisma.invite.findUnique({
      where: { code: validatedData.code },
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

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invitation code' },
        { status: 400 }
      )
    }

    if (invite.used) {
      return NextResponse.json(
        { error: 'Invitation code has already been used' },
        { status: 400 }
      )
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invitation code has expired' },
        { status: 400 }
      )
    }

    if (invite.email !== validatedData.email) {
      return NextResponse.json(
        { error: 'Email does not match invitation' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      // Mark invite as used
      await prisma.invite.update({
        where: { id: invite.id },
        data: { used: true }
      })

      // Update user role to author if they're just a reader
      if (existingUser.role === 'reader') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'author' }
        })
      }

      return NextResponse.json({ 
        message: 'Invitation accepted. Your account has been upgraded to author.',
        user: existingUser 
      })
    }

    return NextResponse.json({ 
      message: 'Invitation is valid. Please complete your registration.',
      invite: {
        id: invite.id,
        email: invite.email,
        invitedBy: invite.invitedBy
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error verifying invite:', error)
    return NextResponse.json(
      { error: 'Failed to verify invitation' },
      { status: 500 }
    )
  }
}

// GET - Check invite code validity
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.json(
      { error: 'Invitation code is required' },
      { status: 400 }
    )
  }

  try {
    const invite = await prisma.invite.findUnique({
      where: { code },
      select: {
        id: true,
        email: true,
        used: true,
        expiresAt: true,
        invitedBy: {
          select: {
            name: true,
          }
        }
      }
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invitation code' },
        { status: 400 }
      )
    }

    if (invite.used) {
      return NextResponse.json(
        { error: 'Invitation code has already been used' },
        { status: 400 }
      )
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invitation code has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: invite.email,
      invitedBy: invite.invitedBy.name
    })
  } catch (error) {
    console.error('Error checking invite:', error)
    return NextResponse.json(
      { error: 'Failed to check invitation' },
      { status: 500 }
    )
  }
} 
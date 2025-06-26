'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarImage } from '@/components/avatar-image'
import Link from 'next/link'
import { toast } from 'sonner'

interface CommentFormProps {
  postId: string
  onCommentAdded?: () => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { data: session, status } = useSession()
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
          postId
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to post comment')
      }

      setComment('')
      toast.success('Comment submitted! It will appear after approval.')
      onCommentAdded?.()
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="mt-8 p-6 bg-secondary/50 rounded-lg animate-pulse">
        <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
        <p className="text-center text-muted-foreground">
          <Link href="/api/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
          {' '}to leave a comment
        </p>
      </div>
    )
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {session.user?.image && (
            <AvatarImage
              src={session.user.image}
              alt={session.user.name || 'Your avatar'}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <span>Leave a comment</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Comments are moderated and will appear after approval.
            </p>
            <Button 
              type="submit" 
              disabled={isSubmitting || !comment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 
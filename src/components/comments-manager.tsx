'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AvatarImage } from '@/components/avatar-image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Check, X, Trash2, Eye, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: string
  content: string
  approved: boolean
  createdAt: string
  author: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  post: {
    id: string
    title: string
    slug: string
  }
}

interface CommentsData {
  comments: Comment[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    pending: number
    approved: number
    total: number
  }
}

interface CommentsManagerProps {
  initialStatus: string
  initialPage: number
}

export function CommentsManager({ initialStatus, initialPage }: CommentsManagerProps) {
  const router = useRouter()
  const [data, setData] = useState<CommentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(initialStatus)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const fetchComments = async (status: string, page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/comments?status=${status}&page=${page}&limit=20`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const commentsData = await response.json()
      setData(commentsData)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments(currentStatus, currentPage)
  }, [currentStatus, currentPage])

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status)
    setCurrentPage(1)
    router.push(`/admin/comments?status=${status}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push(`/admin/comments?status=${currentStatus}&page=${page}`)
  }

  const handleCommentAction = async (commentId: string, action: 'approve' | 'reject' | 'delete') => {
    setActionLoading(commentId)
    try {
      if (action === 'delete') {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete comment')
        toast.success('Comment deleted successfully')
      } else {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            approved: action === 'approve'
          })
        })
        if (!response.ok) throw new Error(`Failed to ${action} comment`)
        toast.success(`Comment ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      }
      
      // Refresh comments
      fetchComments(currentStatus, currentPage)
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error)
      toast.error(`Failed to ${action} comment`)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-8">Failed to load comments</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Comments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Comments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={currentStatus} onValueChange={handleStatusChange}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({data.stats.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({data.stats.approved})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({data.stats.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentStatus} className="space-y-4">
          {data.comments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {currentStatus === 'pending' 
                    ? 'No pending comments to review' 
                    : `No ${currentStatus} comments found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            data.comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {comment.author.image && (
                        <AvatarImage
                          src={comment.author.image}
                          alt={comment.author.name || 'Commenter'}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-base">
                          {comment.author.name || 'Anonymous'}
                        </CardTitle>
                        <CardDescription>
                          {comment.author.email} • {formatDate(new Date(comment.createdAt))}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={comment.approved ? "default" : "secondary"}>
                        {comment.approved ? "Approved" : "Pending"}
                      </Badge>
                      <Link href={`/posts/${comment.post.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Post
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comment on: <strong>{comment.post.title}</strong>
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!comment.approved && (
                        <Button
                          size="sm"
                          onClick={() => handleCommentAction(comment.id, 'approve')}
                          disabled={actionLoading === comment.id}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      
                      {comment.approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCommentAction(comment.id, 'reject')}
                          disabled={actionLoading === comment.id}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCommentAction(comment.id, 'delete')}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {data.pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {data.pagination.pages}
          </span>
          
          <Button
            variant="outline"
            disabled={currentPage === data.pagination.pages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 
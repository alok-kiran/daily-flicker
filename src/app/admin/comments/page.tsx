import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CommentsManager } from '@/components/comments-manager'

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  const resolvedSearchParams = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Comments Management</h1>
        <p className="text-muted-foreground">Moderate and manage user comments</p>
      </div>

      <CommentsManager 
        initialStatus={resolvedSearchParams.status || 'pending'}
        initialPage={parseInt(resolvedSearchParams.page || '1')}
      />
    </div>
  )
} 
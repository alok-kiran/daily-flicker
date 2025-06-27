'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/rich-text-editor'
import { ImagePreview } from '@/components/image-preview'
import { ArrowLeft, Save, Eye, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewPostPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    thumbnail: '',
    published: false,
    featured: false,
    categoryId: '',
    tagIds: [] as string[]
  })
  
  const [categories, setCategories] = useState<Array<{id: string, name: string, color: string}>>([])
  const [tags, setTags] = useState<Array<{id: string, name: string}>>([])
  const [newTag, setNewTag] = useState('')

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        // Fetch tags
        const tagsRes = await fetch('/api/tags')
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          setTags(tagsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag.trim() })
      })

      if (response.ok) {
        const newTagData = await response.json()
        setTags(prev => [...prev, newTagData])
        setFormData(prev => ({
          ...prev,
          tagIds: [...prev.tagIds, newTagData.id]
        }))
        setNewTag('')
        toast.success('Tag created and added!')
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error('Failed to create tag')
    }
  }

  const handleRemoveTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(id => id !== tagId)
    }))
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleSubmit = async (action: 'save' | 'publish') => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsLoading(true)
    
    try {
      const postData = {
        ...formData,
        published: action === 'publish' || formData.published,
        publishedAt: action === 'publish' ? new Date().toISOString() : null
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create post')
      }

      await response.json()
      
      toast.success(action === 'publish' ? 'Post published successfully!' : 'Post saved as draft!')
      router.push('/admin/posts')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Please sign in to create posts</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">Write and publish your blog post</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('save')}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSubmit('publish')}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Post Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter post title..."
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write your post content using the rich text editor</CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Start writing your post..."
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>A brief summary of your post (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter a brief excerpt..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="post-url-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Featured Image URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                />
              </div>

              {/* Featured Image Preview */}
              {formData.thumbnail && (
                <div className="rounded-lg overflow-hidden border">
                  <ImagePreview
                    src={formData.thumbnail} 
                    alt="Featured image preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Post</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Tags */}
              {formData.tagIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tagIds.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId)
                    return tag ? (
                      <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                        {tag.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tagId)}
                        />
                      </Badge>
                    ) : null
                  })}
                </div>
              )}

              {/* Add New Tag */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>

              {/* Existing Tags */}
              <div className="space-y-2">
                <Label>Available Tags</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {tags.filter(tag => !formData.tagIds.includes(tag.id)).map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        tagIds: [...prev.tagIds, tag.id]
                      }))}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Post Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-2">
                  {formData.title || 'Post Title'}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {formData.excerpt || 'Post excerpt will appear here...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  By {session.user?.name} • Draft
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
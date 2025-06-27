import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    // Validate URL
    const targetUrl = new URL(url)
    
    // Fetch the HTML content
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 seconds
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    
    // Extract metadata using regex patterns
    const getMetaContent = (property: string): string | null => {
      const patterns = [
        new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${property}["']`, 'i'),
        new RegExp(`<meta\\s+name=["']${property}["']\\s+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${property}["']`, 'i'),
      ]
      
      for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
      }
      return null
    }

    // Extract title from <title> tag if no og:title
    const getTitleFromTag = (): string | null => {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return titleMatch ? titleMatch[1].trim() : null
    }

    const metadata = {
      title: getMetaContent('og:title') || getMetaContent('twitter:title') || getTitleFromTag(),
      description: getMetaContent('og:description') || getMetaContent('twitter:description') || getMetaContent('description'),
      image: getMetaContent('og:image') || getMetaContent('twitter:image'),
      siteName: getMetaContent('og:site_name') || getMetaContent('twitter:site'),
      url: url,
    }

    // Ensure image URLs are absolute
    if (metadata.image && !metadata.image.startsWith('http')) {
      try {
        const baseUrl = `${targetUrl.protocol}//${targetUrl.host}`
        metadata.image = new URL(metadata.image, baseUrl).toString()
      } catch {
        metadata.image = null
      }
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Link preview error:', error)
    
    // Return minimal metadata on error
    try {
      const fallbackUrl = new URL(url)
      return NextResponse.json({
        title: null,
        description: null,
        image: null,
        siteName: fallbackUrl.hostname,
        url: url,
      })
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }
  }
} 
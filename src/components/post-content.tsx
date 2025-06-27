'use client'

import { useMemo, useEffect, useRef } from 'react'

interface PostContentProps {
  content: string
  className?: string
}

interface LinkMetadata {
  title?: string
  description?: string
  image?: string
  siteName?: string
  url: string
}

export function PostContent({ content, className = "" }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const metadataCache = useRef<Map<string, LinkMetadata>>(new Map())

  const processedContent = useMemo(() => {
    // Process the HTML to add link preview attributes
    let processedHtml = content
    
    // Add data attributes to external links for JavaScript to handle
    processedHtml = processedHtml.replace(
      /<a\s+([^>]*href=["']https?:\/\/[^"']*["'][^>]*)>/gi,
      '<a $1 data-external-link="true">'
    )
    
    return processedHtml
  }, [content])

  useEffect(() => {
    const container = contentRef.current
    const tooltip = tooltipRef.current
    if (!container || !tooltip) return

    let hoverTimeout: NodeJS.Timeout
    let isTooltipVisible = false

    const showTooltip = async (link: HTMLAnchorElement, x: number, y: number) => {
      const href = link.href
      if (!href || !href.startsWith('http')) return

      console.log('Showing tooltip for:', href) // Debug log

      // Position tooltip at cursor position
      tooltip.style.left = `${x}px`
      tooltip.style.top = `${y}px`
      
      // Show loading state
      tooltip.innerHTML = `
        <div class="link-preview-content">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 12px; height: 12px; border: 2px solid #3B82F6; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span style="font-size: 12px; color: #6B7280;">Loading preview...</span>
          </div>
        </div>
      `
      tooltip.classList.add('show')
      isTooltipVisible = true

      // Check cache first
      if (metadataCache.current.has(href)) {
        const metadata = metadataCache.current.get(href)!
        renderTooltipContent(metadata)
        return
      }

      // Fetch metadata
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
        if (response.ok) {
          const metadata = await response.json()
          metadataCache.current.set(href, metadata)
          if (isTooltipVisible) { // Only render if tooltip is still supposed to be visible
            renderTooltipContent(metadata)
          }
        } else {
          if (isTooltipVisible) {
            renderFallbackContent(href)
          }
        }
      } catch (error) {
        console.error('Failed to fetch link metadata:', error)
        if (isTooltipVisible) {
          renderFallbackContent(href)
        }
      }
    }

    const renderTooltipContent = (metadata: LinkMetadata) => {
      if (!tooltip || !isTooltipVisible) return
      
      const domain = new URL(metadata.url).hostname
      
      tooltip.innerHTML = `
        <div class="link-preview-content">
          ${metadata.image ? `<img src="${metadata.image}" alt="Preview" class="link-preview-image" onerror="this.style.display='none'">` : ''}
          ${metadata.title ? `<h4 class="link-preview-title">${metadata.title}</h4>` : ''}
          ${metadata.description ? `<p class="link-preview-description">${metadata.description}</p>` : ''}
          <div class="link-preview-domain">
            <span>${metadata.siteName || domain}</span>
            <span style="margin-left: 4px;">↗</span>
          </div>
        </div>
      `
    }

    const renderFallbackContent = (url: string) => {
      if (!tooltip || !isTooltipVisible) return
      
      const domain = new URL(url).hostname
      
      tooltip.innerHTML = `
        <div class="link-preview-content">
          <div class="link-preview-domain">
            <span>${domain}</span>
            <span style="margin-left: 4px;">↗</span>
          </div>
        </div>
      `
    }

    const hideTooltip = () => {
      console.log('Hiding tooltip') // Debug log
      tooltip.classList.remove('show')
      isTooltipVisible = false
      clearTimeout(hoverTimeout)
    }

    const handleMouseEnter = (e: Event) => {
      const link = e.target as HTMLAnchorElement
      if (!link.hasAttribute('data-external-link')) return

      console.log('Mouse enter on link:', link.href) // Debug log

      // Get the link's position relative to the viewport
      const rect = link.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + window.scrollY - 10 // Position above the link

      clearTimeout(hoverTimeout)
      hoverTimeout = setTimeout(() => {
        showTooltip(link, x, y)
      }, 500) // 500ms delay
    }

    const handleMouseLeave = () => {
      console.log('Mouse leave') // Debug log
      clearTimeout(hoverTimeout)
      // Add a small delay before hiding to allow moving to tooltip
      setTimeout(hideTooltip, 100)
    }

    // Add event listeners to all external links
    const links = container.querySelectorAll('a[data-external-link]')
    console.log('Found external links:', links.length) // Debug log
    
    links.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter)
      link.addEventListener('mouseleave', handleMouseLeave)
    })

    // Also add tooltip hover handlers to keep it visible when hovering over it
    const handleTooltipMouseEnter = () => {
      clearTimeout(hoverTimeout)
    }

    const handleTooltipMouseLeave = () => {
      hideTooltip()
    }

    tooltip.addEventListener('mouseenter', handleTooltipMouseEnter)
    tooltip.addEventListener('mouseleave', handleTooltipMouseLeave)

    // Cleanup
    return () => {
      clearTimeout(hoverTimeout)
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter)
        link.removeEventListener('mouseleave', handleMouseLeave)
      })
      tooltip.removeEventListener('mouseenter', handleTooltipMouseEnter)
      tooltip.removeEventListener('mouseleave', handleTooltipMouseLeave)
    }
  }, [processedContent])

  return (
    <div className="relative">
      <div 
        ref={contentRef}
        className={`prose prose-lg max-w-none post-content ${className}`}
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
      <div 
        ref={tooltipRef}
        className="link-preview-tooltip"
      />
    </div>
  )
} 
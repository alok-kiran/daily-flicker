'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
}

export function ImagePreview({ src, alt, className = "" }: ImagePreviewProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}>
        <div className="text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-50" />
          <p className="text-xs">Invalid URL</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  )
} 
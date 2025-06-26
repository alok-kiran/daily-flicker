'use client'

import { useState } from 'react'
import { User } from 'lucide-react'

interface AvatarImageProps {
  src: string
  alt: string
  className?: string
}

export function AvatarImage({ src, alt, className = "" }: AvatarImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <User className="h-1/2 w-1/2 text-muted-foreground" />
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
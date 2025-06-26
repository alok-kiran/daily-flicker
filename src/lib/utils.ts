import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

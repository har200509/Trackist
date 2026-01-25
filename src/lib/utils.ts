import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getMediaTypeIcon(type: string) {
  switch (type) {
    case 'movie':
      return '🎬'
    case 'tv':
      return '📺'
    case 'book':
      return '📚'
    case 'game':
      return '🎮'
    default:
      return '📱'
  }
}

export function capitalizeFirst(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatStatusName(status: string, mediaType?: string): string {
  const baseStatus = status.replace(/_/g, ' ').split(' ').map(word => capitalizeFirst(word)).join(' ')

  // Customize status text based on media type
  if (status === 'plan_to_watch') {
    switch (mediaType) {
      case 'book': return 'Plan to Read'
      case 'game': return 'Plan to Play'
      case 'movie':
      case 'tv':
      default: return 'Plan to Watch'
    }
  }

  if (status === 'watching') {
    switch (mediaType) {
      case 'book': return 'Reading'
      case 'game': return 'Playing'
      case 'movie':
      case 'tv':
      default: return 'Watching'
    }
  }

  return baseStatus
}

export function formatMediaType(type: string): string {
  const typeMap: Record<string, string> = {
    'movie': 'Movie',
    'tv': 'TV Show',
    'book': 'Book',
    'game': 'Game'
  }
  return typeMap[type] || capitalizeFirst(type)
}
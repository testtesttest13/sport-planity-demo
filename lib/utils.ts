import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper to generate high-quality Unsplash URLs
 */
export function getUnsplashUrl(photoId: string, width = 1000, height?: number): string {
  const heightParam = height ? `&h=${height}` : ''
  return `https://images.unsplash.com/photo-${photoId}?q=80&w=${width}${heightParam}&auto=format&fit=crop`
}


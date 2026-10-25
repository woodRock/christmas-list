'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import { GIFT_PHOTOS_BUCKET } from './giftPhotos'

const MAX_EDGE = 1200

/**
 * Downscales a photo in the browser and re-encodes it. Drawing to a canvas
 * also drops EXIF metadata, so phone location data never leaves the device.
 */
async function shrink(file: File): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('We couldn’t read that image. Try a JPEG or PNG photo.')
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Your browser couldn’t process that image.')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const encode = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

  // Safari can't encode WebP and silently returns PNG, so fall back to JPEG.
  const webp = await encode('image/webp', 0.82)
  if (webp?.type === 'image/webp') return webp
  const jpeg = await encode('image/jpeg', 0.85)
  if (!jpeg) throw new Error('Your browser couldn’t process that image.')
  return jpeg
}

/** Shrinks and uploads a photo into the list's folder; returns its public URL. */
export async function uploadGiftPhoto(supabase: SupabaseClient, listId: string, file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image.')

  const blob = await shrink(file)
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${listId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(GIFT_PHOTOS_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  return supabase.storage.from(GIFT_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl
}

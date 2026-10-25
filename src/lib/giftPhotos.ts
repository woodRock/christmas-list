import type { SupabaseClient } from '@supabase/supabase-js'

export const GIFT_PHOTOS_BUCKET = 'gift-photos'

const PUBLIC_PREFIX = `/storage/v1/object/public/${GIFT_PHOTOS_BUCKET}/`

/** Storage path of a photo uploaded to Giftd, or null for any other image URL (e.g. a retailer's). */
export function giftPhotoPath(url?: string | null) {
  if (!url) return null
  const i = url.indexOf(PUBLIC_PREFIX)
  return i === -1 ? null : decodeURIComponent(url.slice(i + PUBLIC_PREFIX.length).split('?')[0])
}

/**
 * Best-effort removal of uploaded photos that no gift uses any more. Storage
 * policies refuse photos still in use, so passing a URL that is still
 * referenced is harmless.
 */
export async function removeGiftPhotos(supabase: SupabaseClient, urls: Array<string | null | undefined>) {
  const paths = [...new Set(urls.map(giftPhotoPath).filter((p): p is string => Boolean(p)))]
  if (paths.length === 0) return
  const { error } = await supabase.storage.from(GIFT_PHOTOS_BUCKET).remove(paths)
  if (error) console.error('Failed to remove gift photos:', error.message)
}

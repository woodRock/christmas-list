'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Camera, ImageIcon, Images, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { giftPhotoPath, removeGiftPhotos } from '@/lib/giftPhotos'
import { uploadGiftPhoto } from '@/lib/uploadGiftPhoto'
import Modal from '@/components/ui/Modal'
import Button, { buttonClasses } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/components/ui/cn'
import type { Gift } from './types'

interface GiftFormModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => Promise<void>
  familyId: string
  currentUserId: string
  members: { id: string; name: string }[]
  /** Gift to edit; omit to add a new one. */
  gift?: Gift | null
  defaultRecipientId?: string
}

interface ProductPreview {
  title: string
  imageUrl: string
  price: string
}

const emptyPreview: ProductPreview = { title: '', imageUrl: '', price: '' }

const COARSE_POINTER = '(pointer: coarse)'

/** True on phones and tablets, where a "Take photo" button can open the camera directly. */
function useIsTouchDevice() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(COARSE_POINTER)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia(COARSE_POINTER).matches,
    () => false,
  )
}

export default function GiftFormModal(props: GiftFormModalProps) {
  // Mount the form only while open so its state starts fresh from `gift` each time.
  return props.open ? <GiftForm {...props} /> : null
}

function GiftForm({ open, onClose, onSaved, familyId, currentUserId, members, gift, defaultRecipientId }: GiftFormModalProps) {
  const isEdit = Boolean(gift)
  const [name, setName] = useState(gift?.description ?? '')
  const [notes, setNotes] = useState(gift?.notes ?? '')
  const [price, setPrice] = useState(gift?.price?.toString() ?? '')
  const [productUrl, setProductUrl] = useState(gift?.product_url ?? '')
  // An uploaded photo and a product-link image are tracked separately; the
  // photo wins when both exist.
  const originalPhoto = giftPhotoPath(gift?.product_image_url) ? gift?.product_image_url ?? '' : ''
  const [photoUrl, setPhotoUrl] = useState(originalPhoto)
  const [uploading, setUploading] = useState(false)
  const uploadedThisSession = useRef<string[]>([])
  const isTouchDevice = useIsTouchDevice()
  const [preview, setPreview] = useState<ProductPreview>(() =>
    gift
      ? { title: gift.product_title ?? '', imageUrl: originalPhoto ? '' : gift.product_image_url ?? '', price: gift.product_price?.toString() ?? '' }
      : emptyPreview,
  )
  const [recipientId, setRecipientId] = useState(defaultRecipientId ?? currentUserId)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [supabase] = useState(createClient)
  const toast = useToast()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFetchedUrl = useRef(gift?.product_url ?? '')
  // Only auto-fill name/price while the user hasn't typed their own.
  const nameTouched = useRef(Boolean(gift))
  const priceTouched = useRef(Boolean(gift?.price))

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  const fetchMetadata = useCallback(async (url: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!url || !/^https?:\/\//.test(url)) {
      if (!url) setPreview(emptyPreview)
      return
    }
    if (url === lastFetchedUrl.current) return
    lastFetchedUrl.current = url

    setFetching(true)
    setMessage('')
    try {
      const res = await fetch('/api/gifts/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const next = { title: data.title || '', imageUrl: data.imageUrl || '', price: data.price ? data.price.toFixed(2) : '' }
      setPreview(next)
      if (next.title && !nameTouched.current) setName(next.title)
      if (next.price && !priceTouched.current) setPrice(next.price)
    } catch {
      setPreview(emptyPreview)
      setMessage('We couldn’t read details from that link — no problem, just fill them in yourself.')
    } finally {
      setFetching(false)
    }
  }, [])

  const onUrlChange = (value: string) => {
    setProductUrl(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchMetadata(value.trim()), 700)
  }

  const clearPreview = () => {
    setPreview(emptyPreview)
  }

  const onPhotoChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be picked again after removing it
    if (!file) return

    setUploading(true)
    setMessage('')
    try {
      const url = await uploadGiftPhoto(supabase, familyId, file)
      uploadedThisSession.current.push(url)
      setPhotoUrl(url)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Couldn’t upload that photo.')
    } finally {
      setUploading(false)
    }
  }

  // Photos uploaded and then abandoned (cancelled, replaced or removed) are
  // deleted; storage rules refuse anything a gift still uses.
  const handleClose = () => {
    if (submitting) return
    removeGiftPhotos(supabase, uploadedThisSession.current)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const finalName = name.trim() || preview.title
    if (!finalName) {
      setMessage('Give the gift a name so people know what it is.')
      return
    }

    setSubmitting(true)
    const parsedPrice = price ? parseFloat(price) : preview.price ? parseFloat(preview.price) : null
    const product = {
      product_url: productUrl.trim() || null,
      product_title: preview.title || null,
      product_image_url: photoUrl || preview.imageUrl || null,
      product_price: preview.price ? parseFloat(preview.price) : null,
    }

    if (isEdit && gift) {
      const res = await fetch(`/api/gifts/${gift.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: finalName, notes: notes.trim() || null, price: parsedPrice, ...product }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMessage(`Couldn’t save changes: ${data.error || res.statusText}`)
        setSubmitting(false)
        return
      }
      toast('Changes saved')
    } else {
      // Append to the end of the list.
      const { data: maxOrderData } = await supabase
        .from('items')
        .select('order_index')
        .eq('list_id', familyId)
        .order('order_index', { ascending: false })
        .limit(1)
        .maybeSingle()

      const { error } = await supabase.from('items').insert([{
        list_id: familyId,
        user_id: recipientId,
        name: finalName,
        notes: notes.trim() || null,
        price: parsedPrice,
        order_index: maxOrderData ? maxOrderData.order_index + 1 : 0,
        ...product,
      }])

      if (error) {
        setMessage(`Couldn’t add gift: ${error.message}`)
        setSubmitting(false)
        return
      }
      toast(`Added “${finalName}”`)
    }

    removeGiftPhotos(supabase, [...uploadedThisSession.current, originalPhoto].filter((url) => url && url !== photoUrl))
    await onSaved()
    onClose()
  }

  const recipientName = members.find((m) => m.id === recipientId)?.name

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit gift' : 'Add a gift'}
      description={isEdit ? undefined : 'Paste a link and we’ll fill in the details for you.'}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="gift-form" loading={submitting} disabled={uploading}>{isEdit ? 'Save changes' : 'Add to list'}</Button>
        </>
      }
    >
      <form id="gift-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Product link" htmlFor="product-url" optional>
          <div className="relative">
            <Input
              id="product-url"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={productUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              onBlur={(e) => fetchMetadata(e.target.value.trim())}
              className={fetching ? 'pr-10' : undefined}
            />
            {fetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted" aria-label="Fetching product details" />}
          </div>
        </Field>

        {preview.title && (
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted p-2.5 animate-fade-in">
            {preview.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-surface object-contain" />
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface text-muted"><ImageIcon className="h-5 w-5" aria-hidden /></span>
            )}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-ink">{preview.title}</p>
              {preview.price && <p className="text-xs text-muted">${preview.price}</p>}
            </div>
            <button type="button" onClick={clearPreview} className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink" aria-label="Remove product preview">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        <Field
          label="Photo"
          htmlFor="gift-photo"
          optional
          hint={!photoUrl && preview.imageUrl ? 'Using the picture from the product link. Add your own to replace it.' : 'Snap it in a shop or pick one from your photos.'}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-muted">
              {photoUrl || preview.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl || preview.imageUrl} alt="" className={cn('h-full w-full', photoUrl ? 'object-cover' : 'bg-white object-contain p-1')} />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-muted/60"><Camera className="h-6 w-6" aria-hidden /></span>
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-surface/70">
                  <Loader2 className="h-5 w-5 animate-spin text-ink" aria-label="Uploading photo" />
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Separate inputs: Android's photo picker often omits the camera, so
                  "Take photo" uses capture to open it directly. */}
              {isTouchDevice && (
                <span>
                  <input id="gift-photo-camera" type="file" accept="image/*" capture="environment" className="peer sr-only" onChange={onPhotoChosen} disabled={uploading} />
                  <label htmlFor="gift-photo-camera" className={buttonClasses({ variant: 'secondary', size: 'sm', className: cn('cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ring', uploading && 'pointer-events-none opacity-50') })}>
                    <Camera className="h-4 w-4" aria-hidden />
                    Take photo
                  </label>
                </span>
              )}
              <span>
                <input id="gift-photo" type="file" accept="image/*" className="peer sr-only" onChange={onPhotoChosen} disabled={uploading} />
                <label htmlFor="gift-photo" className={buttonClasses({ variant: 'secondary', size: 'sm', className: cn('cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ring', uploading && 'pointer-events-none opacity-50') })}>
                  <Images className="h-4 w-4" aria-hidden />
                  {photoUrl ? 'Choose another' : 'Choose photo'}
                </label>
              </span>
              {photoUrl && (
                <Button variant="ghost" size="sm" onClick={() => setPhotoUrl('')} disabled={uploading}>Remove</Button>
              )}
            </div>
          </div>
        </Field>

        <Field label="What is it?" htmlFor="gift-name">
          <Input
            id="gift-name"
            placeholder="e.g. Cosy wool socks"
            value={name}
            onChange={(e) => {
              nameTouched.current = true
              setName(e.target.value)
            }}
            required={!preview.title}
            data-autofocus={isEdit || undefined}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <Field label="Price" htmlFor="gift-price" optional>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-muted">$</span>
              <Input
                id="gift-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={price}
                onChange={(e) => {
                  priceTouched.current = true
                  setPrice(e.target.value)
                }}
              />
            </div>
          </Field>
          {!isEdit && members.length > 1 && (
            <Field label="Who is it for?" htmlFor="recipient">
              <Select id="recipient" value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.id === currentUserId ? `Me (${member.name})` : member.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>

        <Field label="Notes" htmlFor="gift-notes" optional hint="Size, colour, or anything that helps someone pick the right one.">
          <Textarea id="gift-notes" rows={3} placeholder="e.g. Size M, the dark green one" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>

        {!isEdit && recipientId !== currentUserId && recipientName && (
          <Alert tone="info">This will appear on {recipientName}&apos;s list. They&apos;ll be able to see it.</Alert>
        )}
        {message && <Alert>{message}</Alert>}
      </form>
    </Modal>
  )
}

'use client'

import { useState, useCallback } from 'react'

interface Gift {
  id: string;
  description: string;
  notes?: string;
  price?: number;
  product_url?: string;
  product_title?: string;
  product_image_url?: string;
  product_price?: number;
}

interface EditGiftFormProps {
  gift: Gift;
  onClose: () => void;
  onSave: () => void;
}

export default function EditGiftForm({ gift, onClose, onSave }: EditGiftFormProps) {
  const [newDescription, setNewDescription] = useState(gift.description)
  const [newNotes, setNewNotes] = useState(gift.notes || '')
  const [newPrice, setNewPrice] = useState<string>(gift.price?.toString() || '')
  const [newProductUrl, setNewProductUrl] = useState(gift.product_url || '')
  const [fetchedProductTitle, setFetchedProductTitle] = useState(gift.product_title || '')
  const [fetchedProductImageUrl, setFetchedProductImageUrl] = useState(gift.product_image_url || '')
  const [fetchedProductPrice, setFetchedProductPrice] = useState<string>(gift.product_price?.toString() || '')
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false)
  const [message, setMessage] = useState('')

// Debounce function defined outside the component to be stable
const debounce = <Args extends unknown[]>(func: (...args: Args) => unknown, delay: number): ((...args: Args) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Args) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

  const fetchMetadata = useCallback(async (url: string) => {
    if (!url || !url.startsWith('http')) {
      setFetchedProductTitle('')
      setFetchedProductImageUrl('')
      setFetchedProductPrice('')
      return
    }

    setIsFetchingMetadata(true)
    try {
      const res = await fetch('/api/gifts/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()

      if (res.ok) {
        setFetchedProductTitle(data.title || '')
        setFetchedProductImageUrl(data.imageUrl || '')
        setFetchedProductPrice(data.price ? data.price.toFixed(2) : '')
        // If price is fetched, pre-fill the gift price field
        if (data.price) setNewPrice(data.price.toFixed(2))
      } else {
        setMessage(`Failed to fetch metadata: ${data.error}`)
        setFetchedProductTitle('')
        setFetchedProductImageUrl('')
        setFetchedProductPrice('')
      }
    } catch (error: unknown) {
      let errorMessage = 'Error fetching metadata';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setMessage(`Error fetching metadata: ${errorMessage}`)
      setFetchedProductTitle('')
      setFetchedProductImageUrl('')
      setFetchedProductPrice('')
    } finally {
      setIsFetchingMetadata(false)
    }
  }, [])

  const debouncedFetchMetadata = useCallback(debounce(fetchMetadata, 700), [fetchMetadata])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!newDescription) {
      setMessage('Gift description cannot be empty.')
      return
    }

    const res = await fetch(`/api/gifts/${gift.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: newDescription,
        notes: newNotes,
        price: newPrice ? parseFloat(newPrice) : null,
        product_url: newProductUrl || null,
        product_title: fetchedProductTitle || null,
        product_image_url: fetchedProductImageUrl || null,
        product_price: fetchedProductPrice ? parseFloat(fetchedProductPrice) : null,
      }),
    })

    if (res.ok) {
      setMessage('Gift updated successfully!')
      onSave()
    } else {
      const errorText = await res.text()
      setMessage(`Failed to update gift: ${errorText}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Gift</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gift-description" className="block text-sm font-medium text-gray-300">Gift Description</label>
            <input
              type="text"
              id="gift-description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="product-url" className="block text-sm font-medium text-gray-300">
              Product URL (Optional)
            </label>
            <input
              type="url"
              id="product-url"
              placeholder="e.g., https://example.com/product"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newProductUrl}
              onChange={(e) => {
                setNewProductUrl(e.target.value)
                debouncedFetchMetadata(e.target.value)
              }}
              onBlur={(e) => fetchMetadata(e.target.value)}
            />
            {isFetchingMetadata && <p className="text-sm text-gray-500 mt-1">Fetching product details...</p>}
            {fetchedProductTitle && (
              <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md flex items-center space-x-3">
                {fetchedProductImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fetchedProductImageUrl} alt={fetchedProductTitle} className="w-16 h-16 object-cover rounded-md" />
                )}
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{fetchedProductTitle}</p>
                  {fetchedProductPrice && <p className="text-sm text-gray-600 dark:text-gray-300">${fetchedProductPrice}</p>}
                </div>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="gift-notes" className="block text-sm font-medium text-gray-300">Notes (Optional)</label>
            <textarea
              id="gift-notes"
              placeholder="e.g., Size M, color blue, link to product"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="gift-price" className="block text-sm font-medium text-gray-300">Price (Optional)</label>
            <input
              type="number"
              id="gift-price"
              placeholder="e.g., 25.99"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

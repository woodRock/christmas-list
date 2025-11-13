'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Member {
  id: string;
  name: string;
}

interface AddGiftFormProps {
  familyId: string;
  currentUserId: string;
  members: Member[];
  onClose: () => void; // Add onClose prop
}

// Debounce function defined outside the component to be stable
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export default function AddGiftForm({ familyId, currentUserId, members, onClose }: AddGiftFormProps) {
  const [newGiftDescription, setNewGiftDescription] = useState('')
  const [newGiftNotes, setNewGiftNotes] = useState('')
  const [newGiftPrice, setNewGiftPrice] = useState<string>('')
  const [newProductUrl, setNewProductUrl] = useState('')
  const [fetchedProductTitle, setFetchedProductTitle] = useState('')
  const [fetchedProductImageUrl, setFetchedProductImageUrl] = useState('')
  const [fetchedProductPrice, setFetchedProductPrice] = useState<string>('')
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false)
  const [selectedRecipientId, setSelectedRecipientId] = useState(currentUserId) // Default to current user
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

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
        if (data.price) setNewGiftPrice(data.price.toFixed(2))
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

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!newGiftDescription && !fetchedProductTitle) {
      setMessage('Gift description or fetched product title is required.')
      return
    }

    if (!selectedRecipientId) {
      setMessage('Please select a recipient.')
      return
    }

    // Get the current max order_index for the list
    const { data: maxOrderData, error: _maxOrderError } = await supabase
      .from('items')
      .select('order_index')
      .eq('list_id', familyId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextOrderIndex = maxOrderData ? maxOrderData.order_index + 1 : 0;

    const { error } = await supabase
      .from('items')
      .insert([{
        list_id: familyId,
        user_id: selectedRecipientId,
        name: newGiftDescription || fetchedProductTitle, // Use fetched title if description is empty
        notes: newGiftNotes || null,
        price: newGiftPrice ? parseFloat(newGiftPrice) : (fetchedProductPrice ? parseFloat(fetchedProductPrice) : null),
        order_index: nextOrderIndex,
        product_url: newProductUrl || null,
        product_title: fetchedProductTitle || null,
        product_image_url: fetchedProductImageUrl || null,
        product_price: fetchedProductPrice ? parseFloat(fetchedProductPrice) : null,
      }])

    if (error) {
      setMessage(`Failed to add gift: ${error.message}`)
    } else {
      setMessage(`Gift "${newGiftDescription || fetchedProductTitle}" added successfully!`)
      setNewGiftDescription('')
      setNewGiftNotes('')
      setNewGiftPrice('')
      setNewProductUrl('')
      setFetchedProductTitle('')
      setFetchedProductImageUrl('')
      setFetchedProductPrice('')
      router.refresh() // Refresh the current page to show the new gift
      onClose() // Close the modal after adding gift
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-3">Add a Gift</h3>
        {message && <p className="text-red-500 mb-3">{message}</p>}
        <form onSubmit={handleAddGift} className="space-y-3">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-300">Recipient</label>
            <select
              id="recipient"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              required
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.id === currentUserId ? '(You)' : ''}
                </option>
              ))}
            </select>
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
            <label htmlFor="gift-desc" className="block text-sm font-medium text-gray-300">
              Gift Description (or use fetched title)
            </label>
            <input
              type="text"
              id="gift-desc"
              placeholder="Gift description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newGiftDescription}
              onChange={(e) => setNewGiftDescription(e.target.value)}
              required={!fetchedProductTitle} // Required only if no title is fetched
            />
          </div>
          <div>
            <label htmlFor="gift-notes" className="block text-sm font-medium text-gray-300">
              Notes (Optional)
            </label>
            <textarea
              id="gift-notes"
              placeholder="e.g., Size M, color blue, link to product"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newGiftNotes}
              onChange={(e) => setNewGiftNotes(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="gift-price" className="block text-sm font-medium text-gray-300">
              Price (Optional)
            </label>
            <input
              type="number"
              id="gift-price"
              placeholder="e.g., 25.99"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newGiftPrice}
              onChange={(e) => setNewGiftPrice(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Add Gift
          </button>
        </form>
      </div>
    </div>
  )
}

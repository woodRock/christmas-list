'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Link from 'next/link'
import Image from 'next/image' // Import Image component
import AddGiftForm from './AddGiftForm'
import ClaimUnclaimButtons from './ClaimUnclaimButtons'
import AddMemberForm from './AddMemberForm'
import EditGiftForm from './EditGiftForm' // New component for editing gifts
import QRCode from 'react-qr-code'
import { User } from '@supabase/supabase-js'
import ReactDOM from 'react-dom' // Import ReactDOM

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
  order_index?: number;
  notes?: string; // Add notes
  price?: number; // Add price
  product_url?: string;
  product_title?: string;
  product_image_url?: string;
  product_price?: number;
}

interface Member {
  id: string;
  name: string;
  gifts: Gift[];
}

interface Family {
  id: string;
  name: string;
  owner_id: string;
  members: Member[];
}

// Utility function to format notes with clickable links
const formatNotesWithLinks = (notes?: string) => {
  if (!notes) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return notes.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function FamilyListClient({ initialFamily, initialUser, familyId }: { initialFamily: Family, initialUser: User | null, familyId: string }) {
  const [family, setFamily] = useState<Family>(initialFamily)
  const [user] = useState<User | null>(initialUser)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [sortKey, setSortKey] = useState<keyof Gift | 'order_index'>('order_index'); // Default sort by order_index
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sort order ascending
  const [showQrModal, setShowQrModal] = useState(false)
  const [showAddGiftModal, setShowAddGiftModal] = useState(false) // New state for AddGiftForm modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false) // New state for AddMemberForm modal
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list') // New state for view mode
  const [isDragging, setIsDragging] = useState(false); // New state to track dragging
  const [sourceDroppableId, setSourceDroppableId] = useState<string | null>(null); // New state to track the source list of the dragged item
  const [copyMessage, setCopyMessage] = useState(''); // New state for copy feedback
  const [isFindingImages, setIsFindingImages] = useState(false);
  const [findImagesMessage, setFindImagesMessage] = useState('');
  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  const refreshFamily = async () => {
    const res = await fetch(`/api/lists/${familyId}/details`);
    if (res.ok) {
      const updatedFamily = await res.json();
      setFamily(updatedFamily);
    } else {
      console.error('Failed to refresh family data');
      // Optionally, handle error more gracefully, e.g., show a toast notification
    }
  };

  useEffect(() => {
    let element = document.getElementById('drag-portal');
    if (!element) {
      element = document.createElement('div');
      element.id = 'drag-portal';
      document.body.appendChild(element);
    }
    const animationFrame = requestAnimationFrame(() => {
      setPortalNode(element);
      setMounted(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    console.log('handleDragEnd result:', result);

    // If no destination, or dropped outside any droppable, delete the item
    if (!result.destination) {
      console.log('Dropped outside any droppable. Deleting item:', result.draggableId);
      handleDeleteGift(result.draggableId);
      setIsDragging(false); // End dragging state here if deleted
      setSourceDroppableId(null); // Clear source droppable ID
      return;
    }

    // Check if dropped into a trash bin
    if (result.destination.droppableId === 'trash-bin-global') {
      console.log('Dropped into trash bin:', result.destination.droppableId);
      handleDeleteGift(result.draggableId);
      setIsDragging(false); // End dragging state here if deleted
      setSourceDroppableId(null); // Clear source droppable ID
      return;
    }

    console.log('Dropped into a valid droppable (not trash bin):', result.destination.droppableId);

    const sourceMemberIndex = family.members.findIndex(m => m.id === result.source.droppableId)
    const destinationMemberIndex = family.members.findIndex(m => m.id === result.destination?.droppableId)

    if (sourceMemberIndex === -1 || destinationMemberIndex === -1) {
      console.error('Source or destination member not found.');
      setIsDragging(false); // End dragging state if members not found
      return;
    }

    const newFamily = { ...family }
    const sourceMember = { ...newFamily.members[sourceMemberIndex] }
    const destinationMember = { ...newFamily.members[destinationMemberIndex] }

    // If dropped in the same list and same position, do nothing
    if (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index) {
      setIsDragging(false); // End dragging state if no change
      return;
    }

    const [removed] = sourceMember.gifts.splice(result.source.index, 1)
    destinationMember.gifts.splice(result.destination.index, 0, removed)

    // Re-index gifts in both source and destination members
    sourceMember.gifts = sourceMember.gifts.map((gift, index) => ({ ...gift, order_index: index }));
    destinationMember.gifts = destinationMember.gifts.map((gift, index) => ({ ...gift, order_index: index }));

    // Optimistically update UI
    newFamily.members[sourceMemberIndex] = sourceMember
    newFamily.members[destinationMemberIndex] = destinationMember
    setFamily(newFamily)

    // Store the original family state for potential rollback
    const originalFamily = family;

    // Collect all gifts from the entire family structure that need their order_index updated
    const giftsToUpdate = newFamily.members.flatMap(member =>
      member.gifts.map(gift => ({
        id: gift.id,
        order_index: gift.order_index,
        list_id: family.id, // Include list_id
      }))
    );

    // Call API to update order
    const res = await fetch('/api/gifts/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: giftsToUpdate }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      alert(`Failed to reorder gifts: ${errorText}`)
      // Revert UI on API failure
      setFamily(originalFamily);
    } else {
      refreshFamily(); // Refresh the page to ensure server-side state is consistent
    }
    setIsDragging(false); // End dragging after all logic is complete
  }

  const handleCopyInviteLink = async () => {
    const inviteUrl = `${window.location.origin}/invite?token=${inviteToken}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000); // Clear message after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyMessage('Failed to copy!');
    }
  };

  const handleFindMissingImages = async () => {
    if (!user || user.id !== family.owner_id) {
      alert('Only the list owner can find missing images.');
      return;
    }

    setIsFindingImages(true);
    setFindImagesMessage('Searching for missing images...');

    const giftsToUpdate: Gift[] = [];

    for (const member of family.members) {
      for (const gift of member.gifts) {
        if (!gift.product_image_url && gift.description) {
          setFindImagesMessage(`Searching for image for "${gift.description}"...`);
          try {
            const scrapeRes = await fetch(`/api/scrape-pricespy?query=${gift.description}`);
            const scrapeData = await scrapeRes.json();

            if (scrapeRes.ok && scrapeData.imageUrl) {
              setFindImagesMessage(`Found image for "${gift. description}". Updating...`);
              const updateRes = await fetch('/api/gifts/update-image', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ giftId: gift.id, imageUrl: scrapeData.imageUrl }),
              });

              if (updateRes.ok) {
                giftsToUpdate.push({ ...gift, product_image_url: scrapeData.imageUrl });
              } else {
                const errorText = await updateRes.text();
                console.error(`Failed to update image for ${gift.description}: ${errorText}`);
                setFindImagesMessage(`Failed to update image for "${gift.description}".`);
              }
            } else {
              console.log(`No image found for "${gift.description}" or scraping failed: ${scrapeData.message || scrapeData.error}`);
              setFindImagesMessage(`No image found for "${gift.description}".`);
            }
          } catch (error) {
            console.error(`Error processing ${gift.description}:`, error);
            setFindImagesMessage(`Error processing "${gift.description}".`);
          }
        }
      }
    }

    // Optimistically update the UI with found images
    if (giftsToUpdate.length > 0) {
      const newFamily = { ...family };
      newFamily.members = newFamily.members.map(member => ({
        ...member,
        gifts: member.gifts.map(gift => {
          const updatedGift = giftsToUpdate.find(g => g.id === gift.id);
          return updatedGift || gift;
        })
      }));
      setFamily(newFamily);
    }

    setFindImagesMessage('Finished searching for missing images.');
    setIsFindingImages(false);
    refreshFamily(); // Refresh to ensure server state is fully consistent
  };

  const handleDeleteGift = async (giftId: string) => {
    console.log('Attempting to delete gift:', giftId);

    // Add ownership check here
    if (!user || user.id !== family.owner_id) {
      alert('You do not have permission to delete gifts from this list.');
      return;
    }

    const res = await fetch(`/api/gifts/${giftId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      console.log('Gift deleted successfully from API:', giftId);
      // Update local state to remove the deleted gift
      const newFamily = { ...family };
      newFamily.members = newFamily.members.map(member => ({
        ...member,
        gifts: member.gifts.filter(gift => gift.id !== giftId)
      }));
      setFamily(newFamily);
      console.log('Local state updated for gift:', giftId);
      refreshFamily(); // Refresh data after successful deletion
    } else {
      const errorText = await res.text()
      console.error('Failed to delete gift from API:', giftId, errorText);
      alert(`Failed to delete gift: ${errorText}`)
    }
  }

  const handleSort = (key: keyof Gift | 'order_index') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member? This will delete all of their gifts from the list.')) return

    console.log(`Removing member ${memberId} from family ${family.id}`)

    const res = await fetch(`/api/lists/${family.id}/members/${memberId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      // Update local state to remove the member and their gifts
      const newFamily = { ...family };
      newFamily.members = newFamily.members.filter(member => member.id !== memberId);
      setFamily(newFamily);
      refreshFamily(); // Refresh data after successful member removal
    } else {
      const errorText = await res.text()
      alert(`Failed to remove member: ${errorText}`)
    }
  }

  const generateInvite = async () => {
    const res = await fetch(`/api/lists/${familyId}/invites`, {
      method: 'POST',
    })

    if (res.ok) {
      const { token } = await res.json()
      setInviteToken(token)
      setShowQrModal(true)
    } else {
      const { error } = await res.json()
      alert(`Failed to generate invite link: ${error}`)
    }
  }

  const handleLeaveFamily = async () => {
    if (!confirm('Are you sure you want to leave this family list? You will lose access to all gifts and members.')) return

    const res = await fetch(`/api/lists/${family.id}/leave`, {
      method: 'DELETE',
    })

    if (res.ok) {
      alert('You have successfully left the family list.')
      router.push('/') // Redirect to home page
    } else {
      const errorText: unknown = await res.json()
      alert(`Failed to leave family: ${typeof errorText === 'object' && errorText !== null && 'error' in errorText ? (errorText as { error: string }).error : 'Unknown error'}`)
    }
  }

  const sortedGifts = (gifts: Gift[]) => {
    return [...gifts].sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortKey === 'order_index') {
        valA = a.order_index || 0;
        valB = b.order_index || 0;
      } else if (sortKey === 'price') {
        valA = a.price || 0;
        valB = b.price || 0;
      } else {
        valA = a[sortKey]?.toString().toLowerCase() || '';
        valB = b[sortKey]?.toString().toLowerCase() || '';
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4">{family.name} Christmas List</h1>
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</Link>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-4">
          {user && (
            <button
              onClick={() => setShowAddGiftModal(true)}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Add Gift"
            >
              <Image src="/gift.svg" alt="Add Gift" width={24} height={24} />
              <span className="text-xs mt-1 dark:hover:text-black">Add Gift</span>
            </button>
          )}
          {user && user.id === family.owner_id && (
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Add Member"
            >
              <Image src="/add-user.svg" alt="Add Member" width={24} height={24} />
              <span className="text-xs mt-1 dark:hover:text-black">Add Member</span>
            </button>
          )}
          <button
            onClick={generateInvite}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Invite with QR Code"
          >
            <Image src="/qr_code.svg" alt="QR Code" width={24} height={24} />
            <span className="text-xs mt-1 dark:hover:text-black">Invite</span>
          </button>
          {user && user.id === family.owner_id && ( // Only list owner can trigger this
            <button
              onClick={handleFindMissingImages}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Find Missing Images"
              disabled={isFindingImages}
            >
              <Image src="/file.svg" alt="Find Missing Images" width={24} height={24} /> {/* Using file.svg as a placeholder */}
              <span className="text-xs mt-1 dark:hover:text-black">{isFindingImages ? 'Finding...' : 'Find Images'}</span>
            </button>
          )}
          <Link href="/onboarding"
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Help and Onboarding"
          >
            <Image src="/question.svg" alt="Help" width={24} height={24} />
            <span className="text-xs mt-1 dark:hover:text-black">Help</span>
          </Link>
        </div>

        {isFindingImages && findImagesMessage && (
          <p className="text-center text-sm text-blue-500 mb-4">{findImagesMessage}</p>
        )}

        <div className="mb-4 flex items-center space-x-2">
          <span className="text-gray-300">Sort by:</span>
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            value={sortKey}
            onChange={(e) => handleSort(e.target.value as keyof Gift | 'order_index')}
          >
            <option value="order_index">Default Order</option>
            <option value="description">Description</option>
            <option value="price">Price</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-gray-200 rounded-md text-sm"
          >
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
          <div className="ml-auto flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              ▦ Grid
            </button>
          </div>
        </div>

        <DragDropContext
          onBeforeDragStart={(start) => {
            setIsDragging(true);
            setSourceDroppableId(start.source.droppableId); // Set the ID of the list the item is dragged from
          }}
          onDragEnd={handleDragEnd}
        >
          {family.members.map((member) => (
            <div key={member.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4">{member.name}&#39;s List</h2>
                {user && user.id === family.owner_id && user.id !== member.id && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
              {member.gifts.length === 0 ? (
                <p>No gifts on {member.name}&#39;s list yet.</p>
              ) : (
                <Droppable droppableId={member.id} isDropDisabled={isDragging && sourceDroppableId !== member.id}>
                  {(provided) => (
                    <ul
                      className={`relative ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'list-disc pl-5 space-y-2'}`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {sortedGifts(member.gifts).map((gift, index) => (
                        <Draggable key={gift.id} draggableId={gift.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps} // Apply dragHandleProps here
                              onDoubleClick={() => {
                                if (user && user.id === gift.user_id) {
                                  setEditingGift(gift);
                                }
                              }}
                              className={`bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm ${viewMode === 'grid' ? 'relative aspect-square overflow-hidden flex flex-col justify-between' : 'flex flex-col items-center sm:flex-row sm:items-center sm:justify-between p-2'}`}
                            >
                              {viewMode === 'grid' ? (
                                <>
                                  {gift.product_image_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={gift.product_image_url} alt={gift.product_title || gift.description} className="w-full h-2/3 object-cover" />
                                  )}
                                  <div className="p-2 flex-grow flex flex-col justify-between">
                                    <div className="flex items-baseline"> {/* Use flex to put description and claimed by on same line */}
                                      <span className="text-sm font-semibold break-words">
                                        {gift.description}
                                      </span>
                                      {gift.is_purchased && user?.id !== gift.user_id && (
                                        <span className="ml-2 text-xs text-green-600 flex-shrink-0"> {/* Add ml-2 for spacing and flex-shrink-0 to prevent wrapping too early */}
                                          (Claimed by {family.members.find(m => m.id === gift.purchased_by)?.name})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {gift.price !== undefined && gift.price !== null && (
                                    <div className="absolute bottom-2 left-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      ${gift.price.toFixed(2)}
                                    </div>
                                  )}
                                  <div className="absolute bottom-2 right-2 flex flex-col sm:flex-row sm:space-x-1 space-y-1">
                                    {gift.product_url && (
                                      <a
                                        href={gift.product_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-blue-500 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label="Open Link"
                                      >
                                        <Image src="/link.svg" alt="Open Link" width={20} height={20} />
                                      </a>
                                    )}
                                    {user && user.id !== gift.user_id && (
                                      <ClaimUnclaimButtons
                                        gift={gift}
                                        userId={user.id}
                                        refreshFamily={refreshFamily}
                                      />
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex w-full p-2"> {/* Main container for image + text/price + buttons */}
                                    {gift.product_image_url && (
                                      // Image on the left
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={gift.product_image_url} alt={gift.product_title || gift.description} className="w-24 h-24 object-cover rounded-md mr-3 flex-shrink-0" />
                                    )}

                                    <div className="flex-grow flex flex-col justify-between"> {/* Container for description, claimed by, and price */}
                                      <div> {/* Description and claimed by */}
                                        <span className="font-semibold break-words">
                                          {gift.description}
                                        </span>
                                        {gift.is_purchased && user?.id !== gift.user_id && (
                                          <span className="ml-2 text-sm text-green-600">
                                            (Claimed by {family.members.find(m => m.id === gift.purchased_by)?.name})
                                          </span>
                                        )}
                                      </div>
                                      {gift.price !== undefined && gift.price !== null && (
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                                          ${gift.price.toFixed(2)}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-shrink-0 flex flex-col justify-end items-end ml-auto"> {/* Buttons container */}
                                      {gift.product_url && (
                                        <a
                                          href={gift.product_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-2 text-blue-500 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
                                          onClick={(e) => e.stopPropagation()}
                                          aria-label="Open Link"
                                        >
                                          <Image src="/link.svg" alt="Open Link" width={24} height={24} />
                                        </a>
                                      )}
                                      {user && user.id !== gift.user_id && (
                                        <ClaimUnclaimButtons
                                        gift={gift}
                                        userId={user.id}
                                        refreshFamily={refreshFamily}
                                      />
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              )}
            </div>
          ))}

          {mounted && portalNode && ReactDOM.createPortal(
            <Droppable droppableId="trash-bin-global">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 border-2 border-dashed rounded-lg text-center transition-all duration-200 z-50
                    border-red-500 bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200
                    ${isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  Drag here to delete gift 🗑️
                  {provided.placeholder}
                </div>
              )}
            </Droppable>,
            portalNode
          )}
        </DragDropContext>

        {/* Modals */}
        {showAddGiftModal && user && (
          <AddGiftForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
            onClose={() => setShowAddGiftModal(false)} // Pass onClose prop
            onGiftAdded={refreshFamily} // Pass refreshFamily to AddGiftForm
          />
        )}

        {showAddMemberModal && user && user.id === family.owner_id && (
          <AddMemberForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
            onClose={() => setShowAddMemberModal(false)} // Pass onClose prop
            onMemberAdded={refreshFamily} // Pass refreshFamily to AddMemberForm
          />
        )}

        {user && user.id !== family.owner_id && (
          <div className="mt-4">
            <button
              onClick={handleLeaveFamily}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Leave Family List
            </button>
          </div>
        )}

        {editingGift && (
          <EditGiftForm
            gift={editingGift}
            onClose={() => setEditingGift(null)}
            onSave={async () => { // Make the onSave callback async
              setEditingGift(null)
              await refreshFamily() // Call refreshFamily after saving an edited gift
            }}
          />
        )}

        {showQrModal && inviteToken && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Scan to Join!</h2>
              <QRCode value={`${window.location.origin}/invite?token=${inviteToken}`} />
              {copyMessage && <p className="text-green-500 mt-2">{copyMessage}</p>}
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={handleCopyInviteLink}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Copy Invite Link
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


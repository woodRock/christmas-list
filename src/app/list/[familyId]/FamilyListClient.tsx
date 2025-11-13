'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Link from 'next/link'
import AddGiftForm from './AddGiftForm'
import ClaimUnclaimButtons from './ClaimUnclaimButtons'
import AddMemberForm from './AddMemberForm'
import EditGiftForm from './EditGiftForm' // New component for editing gifts
import QRCode from 'react-qr-code'

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
  order_index?: number;
  notes?: string; // Add notes
  price?: number; // Add price
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

export default function FamilyListClient({ initialFamily, initialUser, familyId }: { initialFamily: Family, initialUser: any, familyId: string }) {
  const [family, setFamily] = useState<Family>(initialFamily)
  const [user] = useState(initialUser)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [expandedGiftId, setExpandedGiftId] = useState<string | null>(null); // State for expanded gift
  const [sortKey, setSortKey] = useState<keyof Gift | 'order_index'>('order_index'); // Default sort by order_index
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sort order ascending
  const [showQrModal, setShowQrModal] = useState(false)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const sourceMemberIndex = family.members.findIndex(m => m.id === result.source.droppableId)
    const destinationMemberIndex = family.members.findIndex(m => m.id === result.destination?.droppableId)

    if (sourceMemberIndex === -1 || destinationMemberIndex === -1) return

    const newFamily = { ...family }
    const sourceMember = { ...newFamily.members[sourceMemberIndex] }
    const destinationMember = { ...newFamily.members[destinationMemberIndex] }

    const [removed] = sourceMember.gifts.splice(result.source.index, 1)
    destinationMember.gifts.splice(result.destination.index, 0, removed)

    // Re-index gifts in both source and destination members
    sourceMember.gifts = sourceMember.gifts.map((gift, index) => ({ ...gift, order_index: index }));
    destinationMember.gifts = destinationMember.gifts.map((gift, index) => ({ ...gift, order_index: index }));

    // Optimistically update UI
    newFamily.members[sourceMemberIndex] = sourceMember
    newFamily.members[destinationMemberIndex] = destinationMember
    setFamily(newFamily)

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
      router.refresh() // Revert UI on failure
    }
  }

  const handleDeleteGift = async (giftId: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return

    const res = await fetch(`/api/gifts/${giftId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.refresh()
    } else {
      const errorText = await res.text()
      alert(`Failed to delete gift: ${errorText}`)
    }
  }

  const handleToggleExpand = (giftId: string) => {
    setExpandedGiftId(expandedGiftId === giftId ? null : giftId);
  };

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
      router.refresh()
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
      const errorText = await res.json()
      alert(`Failed to leave family: ${errorText.error}`)
    }
  }

  const sortedGifts = (gifts: Gift[]) => {
    return [...gifts].sort((a, b) => {
      let valA: any;
      let valB: any;

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
        </div>

        {family.members.map((member) => (
          <div key={member.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-4">{member.name}'s List</h2>
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
              <p>No gifts on {member.name}'s list yet.</p>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={member.id}>
                  {(provided) => (
                    <ul
                      className="list-disc pl-5 space-y-2"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {sortedGifts(member.gifts).map((gift, index) => (
                        <Draggable key={gift.id} draggableId={gift.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex flex-col justify-between items-start bg-gray-50 dark:bg-gray-700 p-2 rounded-md shadow-sm"
                            >
                              <div
                                className="flex justify-between w-full items-center"
                                {...provided.dragHandleProps} // Apply drag handle props here
                              >
                                <span
                                  className="cursor-pointer flex-grow"
                                  onClick={() => handleToggleExpand(gift.id)}
                                >
                                  {gift.description}
                                  {gift.is_purchased && user.id !== gift.user_id && (
                                    <span className="ml-2 text-sm text-green-600">
                                      (Claimed by {family.members.find(m => m.id === gift.purchased_by)?.name})
                                    </span>
                                  )}
                                </span>
                                <div className="flex items-center space-x-2">
                                  {user && user.id === gift.user_id && ( // Only owner can edit/delete
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setEditingGift(gift); }}
                                        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteGift(gift.id); }}
                                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                  {user && user.id !== gift.user_id && (
                                    <ClaimUnclaimButtons
                                      gift={gift}
                                      userId={user.id}
                                    />
                                  )}
                                </div>
                              </div>
                              {expandedGiftId === gift.id && (
                                <div className="mt-2 text-sm text-gray-300 w-full">
                                  {gift.notes && (
                                    <p><strong>Notes:</strong> {formatNotesWithLinks(gift.notes)}</p>
                                  )}
                                  {gift.price && (
                                    <p><strong>Price:</strong> ${gift.price.toFixed(2)}</p>
                                  )}
                                </div>
                              )}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        ))}

        {user && (
          <AddGiftForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
          />
        )}

        <div className="mt-8">
          <button
            onClick={generateInvite}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Invite with QR Code
          </button>
        </div>

        {user && user.id === family.owner_id && (
          <AddMemberForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
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
            onSave={() => {
              setEditingGift(null)
              router.refresh()
            }}
          />
        )}

        {showQrModal && inviteToken && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Scan to Join!</h2>
              <QRCode value={`${window.location.origin}/invite?token=${inviteToken}`} />
              <button
                onClick={() => setShowQrModal(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


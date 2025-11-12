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

interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
  order_index?: number; // Add order_index
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

export default function FamilyListClient({ initialFamily, initialUser, familyId }: { initialFamily: Family, initialUser: any, familyId: string }) {
  const [family, setFamily] = useState<Family>(initialFamily)
  const [user] = useState(initialUser)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
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

    // Update order_index for all affected gifts
    const updatedGifts = destinationMember.gifts.map((gift, index) => ({
      ...gift,
      order_index: index,
    }))

    // Optimistically update UI
    newFamily.members[sourceMemberIndex] = sourceMember
    newFamily.members[destinationMemberIndex] = destinationMember
    setFamily(newFamily)

    // Call API to update order
    const { error } = await supabase
      .from('items')
      .upsert(updatedGifts.map(g => ({ id: g.id, order_index: g.order_index })))

    if (error) {
      console.error('Error reordering gifts:', error)
      // Revert UI if API call fails
      router.refresh()
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

  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4">{family.name} Christmas List</h1>
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</Link>

        {family.members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">{member.name}'s List</h2>
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
                      {member.gifts.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((gift, index) => (
                        <Draggable key={gift.id} draggableId={gift.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex justify-between items-center bg-gray-50 p-2 rounded-md shadow-sm"
                            >
                              <span>
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
                                      onClick={() => setEditingGift(gift)}
                                      className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGift(gift.id)}
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

        {user && (
          <AddMemberForm
            familyId={family.id}
            currentUserId={user.id}
            members={family.members}
          />
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
      </div>
    </div>
  )
}

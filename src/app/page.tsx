import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: families, error } = await supabase.rpc('get_lists_for_user', { user_id: user.id })

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Family Lists</h1>

        {error && <p className="text-red-500 text-center mb-4">{error.message}</p>}

        {families && families.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">You are not a member of any family lists yet.</p>
            <p className="text-gray-600">You can either create your own list or ask someone to add you to their existing list.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {families?.map((family: { id: string; name: string }) => (
              <li key={family.id} className="bg-white p-6 rounded-lg shadow-md">
                <Link href={`/list/${family.id}`} className="text-2xl font-semibold text-blue-600 hover:underline">
                  {family.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <Link href="/create-family" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg font-medium">
            Create New Family List
          </Link>
        </div>
      </div>
    </div>
  )
}
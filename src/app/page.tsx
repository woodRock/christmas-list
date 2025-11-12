import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: families, error } = await supabase
    .from('lists')
    .select('id, name')

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Family Lists</h1>

        {error && <p className="text-red-500 text-center mb-4">{error.message}</p>}

        {families && families.length === 0 ? (
          <p className="text-center text-gray-600">No family lists created yet.</p>
        ) : (
          <ul className="space-y-4">
            {families?.map((family) => (
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
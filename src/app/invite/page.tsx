import { Suspense } from 'react'; // Import Suspense
import InviteClient from './InviteClient'

export default function InvitePage() {
  return (
    <Suspense fallback={<p>Loading invite...</p>}> {/* Wrap with Suspense */}
      <InviteClient />
    </Suspense>
  )
}


import { getMembers } from '@/lib/actions/members'
import { MembersTable } from '../components'

export default async function Members() {
  const members = await getMembers()

  return (
    <main>
      <div className="page-header"></div>

      <MembersTable members={members} />
    </main>
  )
}

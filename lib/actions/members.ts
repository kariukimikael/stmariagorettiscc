'use server'

// NOTE: Auth is skipped for now — RLS policies are open.
// TODO: Re-enable auth-gated RLS policies once authentication is implemented.

import { cookies } from 'next/headers'
import { createClient } from '../supabase/server'

// ------------- Types ----------------------
export type MemberStatus = 'active' | 'inactive'

export interface Member {
  id: string
  first_name: string
  last_name: string
  phone: string
  role: string
  status: MemberStatus
  joined_at: string
  created_at: string
}

// ---------------------- ACTIONS ---------------

export async function getMembers(): Promise<Member[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('first_name', { ascending: true })

  if (error) throw new Error(error.message)

  return data as Member[]
}

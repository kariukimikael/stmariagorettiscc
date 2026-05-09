'use client'

import { useState } from 'react'
import type { Member } from '@/lib/actions/members'

interface Props {
  members: Member[]
}
const MembersTable = ({ members }: Props) => {
  return (
    <div>
      <div className="functions"></div>
      <div className="table">
        <table>
          <thead>
            <tr className="">
              {['Member', 'Phone', 'Role', 'Status', 'Joined'].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members?.map((member) => (
              <tr key={member.id}>
                <td>
                  <span>
                    {member.first_name} {member.last_name}
                  </span>
                </td>
                <td>{member.phone}</td>
                <td>{member.role}</td>
                <td>{member.status}</td>
                <td>{member.joined_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MembersTable

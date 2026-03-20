'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Shield, Users, Search } from 'lucide-react'
import { MemberCard } from '@/components/team/MemberCard'
import { AddMemberForm } from '@/components/team/AddMemberForm'

interface TeamListProps {
  members: any[]
  isAdmin: boolean
  currentUserId: string
}

export function TeamList({ members, isAdmin, currentUserId }: TeamListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const adminMembers = filteredMembers.filter(m => m.role === 'admin')
  const regularMembers = filteredMembers.filter(m => m.role === 'member')
  const totalMembers = members.length
  const adminCount = members.filter(m => m.role === 'admin').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.22em] text-primary">Roster Control</p>
          <h1 className="font-heading text-4xl uppercase tracking-[0.06em] text-zinc-950 dark:text-white">Danh sách thành viên</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">{totalMembers} thành viên • {adminCount} quản trị viên</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thành viên..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isAdmin && <AddMemberForm />}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-1 h-fit overflow-hidden rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
          <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
            <CardTitle className="flex items-center font-heading text-lg uppercase tracking-[0.1em] text-zinc-950 dark:text-white">
              <Shield className="mr-2 h-5 w-5" />
              Ban quản lý
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {adminMembers.length > 0 ? (
              <div className="divide-y">
                {adminMembers.map((m) => (
                  <MemberCard key={m._id} member={m} isAdmin={isAdmin} currentUserId={currentUserId} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Không tìm thấy quản trị viên.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 h-fit overflow-hidden rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
          <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
            <CardTitle className="flex items-center font-heading text-lg uppercase tracking-[0.1em] text-zinc-950 dark:text-white">
              <Users className="mr-2 h-5 w-5" />
              Cầu thủ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {regularMembers.length > 0 ? (
              <div className="divide-y">
                {regularMembers.map((m) => (
                  <MemberCard key={m._id} member={m} isAdmin={isAdmin} currentUserId={currentUserId} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Không tìm thấy cầu thủ nào.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, MapPin, Clock, Trophy, Dumbbell, Search } from 'lucide-react'
import Link from "next/link"
import { getEventCardActions, getEventLifecycleState } from '@/lib/events'

interface Event {
  _id: string
  title: string
  type: 'match' | 'training'
  date: string
  startTime: string
  endTime: string
  location?: string
}

interface EventsListProps {
  events: Event[]
  now?: Date
}

export function EventsList({ events, now = new Date() }: EventsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === "all" || event.type === typeFilter
    
    const eventDate = new Date(event.date)
    const now = new Date()
    // Reset time for date comparison
    now.setHours(0, 0, 0, 0)
    
    let matchesStatus = true
    if (statusFilter === "upcoming") {
      matchesStatus = eventDate >= now
    } else if (statusFilter === "past") {
      matchesStatus = eventDate < now
    }

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sự kiện..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Loại sự kiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="match">Trận đấu</SelectItem>
              <SelectItem value="training">Tập luyện</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="upcoming">Sắp tới</SelectItem>
              <SelectItem value="past">Đã qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Không tìm thấy sự kiện nào.
          </div>
        ) : (
          filteredEvents.map((e) => (
            <Card key={e._id} className="flex flex-col overflow-hidden rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
              <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/10 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="font-heading text-2xl uppercase tracking-[0.06em]">{e.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 uppercase tracking-[0.14em]">
                      {e.type === 'match' ? <><Trophy className="h-4 w-4" /> Trận đấu</> : <><Dumbbell className="h-4 w-4" /> Tập luyện</>}
                    </CardDescription>
                  </div>
                  <div className="border border-zinc-200 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                    {getEventLifecycleState(e, now) === 'ended' ? 'Đã xong' : 'Sắp diễn ra'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 pt-5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(e.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{e.startTime} - {e.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{e.location || 'Chưa xác định'}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70">
                {(() => {
                  const actions = getEventCardActions(e, now)
                  return (
                    <>
                      {actions.showRsvp && (
                        <Button variant="outline" size="sm" asChild className="rounded-none uppercase tracking-[0.08em]">
                          <Link href={`/events/${e._id}`}>RSVP</Link>
                        </Button>
                      )}
                      {actions.showAttendance && (
                        <Button variant="outline" size="sm" asChild className="rounded-none uppercase tracking-[0.08em]">
                          <Link href={`/attendance/${e._id}`}>Điểm danh</Link>
                        </Button>
                      )}
                      {actions.showVoting && (
                        <Button variant="outline" size="sm" asChild className="rounded-none uppercase tracking-[0.08em]">
                          <Link href={`/voting/${e._id}`}>Bình chọn MVP</Link>
                        </Button>
                      )}
                      {actions.showPayments && (
                        <Button variant="outline" size="sm" asChild className="rounded-none uppercase tracking-[0.08em]">
                          <Link href={`/match-payments/${e._id}`}>Thanh toán</Link>
                        </Button>
                      )}
                    </>
                  )
                })()}
                {e.type === 'match' && getEventLifecycleState(e, now) !== 'ended' && (
                  <>
                    <span className="ml-auto text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                      MVP mở sau khi trận đấu kết thúc
                    </span>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

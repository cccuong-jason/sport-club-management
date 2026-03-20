'use client'

import { createEvent } from '@/app/[locale]/(main)/events/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRef } from 'react'
import { toast } from 'sonner'
import { EventSchedulePicker } from '@/components/events/EventSchedulePicker'

export function CreateEventForm({ seasons = [] }: { seasons?: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await createEvent(formData)
    if (result?.success) {
      toast.success(result.message)
      formRef.current?.reset()
    } else {
      toast.error(result?.message || 'Tạo sự kiện thất bại')
    }
  }

  return (
    <Card className="rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
        <CardTitle className="font-heading text-2xl uppercase tracking-[0.08em]">Tạo sự kiện</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input name="title" placeholder="Tiêu đề sự kiện" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <Select name="type" defaultValue="training">
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Tập luyện</SelectItem>
                  <SelectItem value="match">Trận đấu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lịch trình (Khoảng thời gian)</Label>
            <EventSchedulePicker />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm</Label>
              <Input name="location" placeholder="Sân hoặc địa chỉ" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seasonId">Mùa giải (Tùy chọn)</Label>
              <Select name="seasonId">
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mùa giải" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
                  {seasons.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="rounded-none px-6 font-heading uppercase tracking-[0.12em]">Tạo sự kiện</Button>
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { addMinutes, format, setHours, setMinutes } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, Clock3 } from 'lucide-react'

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, '0')
  const minutes = index % 2 === 0 ? '00' : '30'
  return `${hours}:${minutes}`
})

function combineDateAndTime(date: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return setMinutes(setHours(new Date(date), hours), minutes)
}

export function EventSchedulePicker() {
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState('19:00')
  const [endTime, setEndTime] = useState('21:00')

  const endOptions = useMemo(() => {
    const start = combineDateAndTime(date, startTime)
    return timeOptions.filter((option) => combineDateAndTime(date, option) > start)
  }, [date, startTime])

  const startDateTime = combineDateAndTime(date, startTime)
  const endDateTime = combineDateAndTime(date, endTime)

  return (
    <div className="space-y-2">
      <input type="hidden" name="dateTimeStart" value={format(startDateTime, "yyyy-MM-dd'T'HH:mm")} />
      <input type="hidden" name="dateTimeEnd" value={format(endDateTime, "yyyy-MM-dd'T'HH:mm")} />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-auto w-full justify-between rounded-none border-zinc-300 bg-white px-4 py-4 text-left shadow-none hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Lịch trình trận đấu</div>
              <div className="font-medium text-zinc-950 dark:text-white">
                {format(date, 'PPP', { locale: vi })}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                {startTime} - {endTime}
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <CalendarDays className="h-4 w-4" />
              <Clock3 className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[min(92vw,720px)] rounded-none border-zinc-200 bg-white p-0 shadow-[0_24px_60px_rgba(0,0,0,0.14)] dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="grid gap-0 md:grid-cols-[1fr_260px]">
            <div className="border-b border-zinc-200 p-4 dark:border-zinc-800 md:border-b-0 md:border-r">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(value) => value && setDate(value)}
                locale={vi}
                className="mx-auto"
              />
            </div>
            <div className="space-y-4 p-4">
              <div>
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Bắt đầu</div>
                <Select value={startTime} onValueChange={(value) => {
                  setStartTime(value)
                  const proposedEnd = combineDateAndTime(date, endTime)
                  if (proposedEnd <= combineDateAndTime(date, value)) {
                    setEndTime(format(addMinutes(combineDateAndTime(date, value), 120), 'HH:mm'))
                  }
                }}>
                  <SelectTrigger className="rounded-none border-zinc-300 dark:border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {timeOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Kết thúc</div>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger className="rounded-none border-zinc-300 dark:border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {endOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Match and training sessions are limited to one calendar day. Pick the day once, then choose the start and end time here.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

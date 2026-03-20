import { connectDB } from '@/lib/db'
import { Event } from '@/models/Event'
import { getAuthUser } from '@/lib/auth-user'
import { addDays, endOfMonth, endOfWeek, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

async function getMonthEvents(clubId?: string, date = new Date()) {
  await connectDB()
  if (!clubId) return []
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const items = await Event.find({ clubId, date: { $gte: start, $lte: end } }).lean<any>()
  return items
}

export default async function SeasonCalendarPage() {
  const authUser = await getAuthUser()
  const today = new Date()
  const events = await getMonthEvents(authUser?.activeClubId, today)
  const start = startOfWeek(startOfMonth(today), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(today), { weekStartsOn: 1 })
  const days: Date[] = []
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d)

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <main className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.22em] text-primary">Season Calendar</p>
          <h1 className="font-heading text-4xl uppercase tracking-[0.06em] text-zinc-950 dark:text-white">
            Match Timeline
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            Calendar view of all current club sessions and matches.
          </p>
        </div>
        <Link
          href="/seasons"
          className="border border-zinc-300 px-4 py-2 font-heading text-xs uppercase tracking-[0.18em] text-zinc-700 transition-colors hover:border-primary hover:bg-primary hover:text-black dark:border-zinc-700 dark:text-zinc-200"
        >
          Back to Seasons
        </Link>
      </div>

      <section className="overflow-hidden rounded-none border border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent px-6 py-5 dark:border-zinc-800/70 dark:from-primary/15">
          <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-zinc-950 dark:text-white">
            {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-800">
          {weekDays.map((day) => (
            <div key={day} className="bg-zinc-50 p-3 text-center text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
              {day}
            </div>
          ))}
          {days.map((d, idx) => {
            const dayEvents = events.filter((e: any) => isSameDay(new Date(e.date), d))
            return (
              <div
                key={idx}
                className={cn(
                  'min-h-[130px] bg-white p-3 transition-colors hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/80',
                  !isSameMonth(d, today) && 'bg-zinc-100/70 text-zinc-400 dark:bg-zinc-900/60'
                )}
              >
                <div
                  className={cn(
                    'mb-3 flex h-8 w-8 items-center justify-center border text-sm font-black',
                    isToday(d) && 'border-primary bg-primary text-black',
                    !isToday(d) && 'border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200'
                  )}
                >
                  {d.getDate()}
                </div>
                <div className="space-y-2">
                  {dayEvents.map((e: any) => (
                    <Link
                      key={e._id}
                      href={`/events/${e._id}`}
                      className={cn(
                        'block border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors',
                        e.type === 'match'
                          ? 'border-primary/30 bg-primary/15 text-zinc-900 hover:bg-primary hover:text-black dark:text-white'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-800 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
                      )}
                    >
                      {e.type === 'match' ? 'Match' : 'Training'} · {e.title}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

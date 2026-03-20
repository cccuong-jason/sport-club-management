import { connectDB } from '@/lib/db'
import { Event } from '@/models/Event'
import { Season } from '@/models/Season'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { CreateEventForm } from '@/components/events/CreateEventForm'
import { EventsList } from '@/components/events/EventsList'

async function listEvents(clubId?: string) {
  await connectDB()
  if (!clubId) return []
  const items = await Event.find({ clubId }).sort({ date: -1 }).lean<any>()
  return items.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    date: item.date.toISOString(),
  }))
}

async function getSeasons(clubId?: string) {
  await connectDB()
  if (!clubId) return []
  const seasons = await Season.find({ clubId }).sort({ startDate: -1 }).lean<any>()
  return seasons.map((s: any) => ({
    ...s,
    _id: s._id.toString(),
    startDate: s.startDate.toISOString(),
    endDate: s.endDate.toISOString()
  }))
}

export default async function EventsPage() {
  const authUser = await getAuthUser()
  const events = await listEvents(authUser?.activeClubId)
  const seasons = await getSeasons(authUser?.activeClubId)

  return (
    <main className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.22em] text-primary">Event Control</p>
          <h1 className="font-heading text-4xl uppercase tracking-[0.06em] text-zinc-950 dark:text-white">Sự kiện</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">Các trận đấu và buổi tập sắp tới.</p>
        </div>
      </div>

      {isAdmin(authUser?.role) && <CreateEventForm seasons={seasons} />}

      <EventsList events={events} />
    </main>
  )
}

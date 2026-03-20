import { connectDB } from '@/lib/db'
import { Event } from '@/models/Event'
import { RSVP } from '@/models/RSVP'
import { User } from '@/models/User'
import { getAuthUser } from '@/lib/auth-user'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function EventDetail(props: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await props.params
  const authUser = await getAuthUser()
  if (!authUser) redirect('/')
  await connectDB()
  const event = await Event.findById(eventId).lean<any>()
  if (!event) return <main className="p-6">Event not found</main>

  const user = await User.findOne({ clerkId: authUser.clerkId }).lean<any>()
  const myRsvp = user ? await RSVP.findOne({ eventId, userId: user._id }).lean<any>() : null
  const allRsvps = await RSVP.find({ eventId }).lean<any>()
  const rsvpCounts = {
    yes: allRsvps.filter((r: any) => r.status === 'yes').length,
    no: allRsvps.filter((r: any) => r.status === 'no').length,
    maybe: allRsvps.filter((r: any) => r.status === 'maybe').length
  }

  async function rsvp(formData: FormData) {
    'use server'
    const authUser = await getAuthUser()
    if (!authUser?.clerkId) return
    await connectDB()
    const status = String(formData.get('status') || 'maybe') as 'yes' | 'no' | 'maybe'
    const user = await (await import('@/models/User')).User.findOne({ clerkId: authUser.clerkId })
    if (!user) return
    await RSVP.updateOne({ eventId, userId: user._id }, { status }, { upsert: true })
    revalidatePath(`/events/${eventId}`)
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="overflow-hidden border border-zinc-200 bg-[linear-gradient(180deg,rgba(194,255,87,0.08),transparent_32%),rgba(255,255,255,0.92)] p-8 shadow-[0_22px_55px_rgba(0,0,0,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-[linear-gradient(180deg,rgba(194,255,87,0.06),transparent_32%),rgba(7,10,8,0.96)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.22em] text-primary">Event Detail</p>
            <h1 className="mt-3 font-heading text-5xl uppercase tracking-[0.05em] text-zinc-950 dark:text-white">{event.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="border border-primary/25 bg-primary/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-900 dark:text-white">
                {event.type === 'training' ? 'Training' : 'Match'}
              </span>
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              {(event.startTime || event.endTime) && (
                <span>🕐 {[event.startTime, event.endTime].filter(Boolean).join(' - ')}</span>
              )}
              {event.location && <span>📍 {event.location}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Attendance</div>
            <div className="text-3xl font-black text-primary">{rsvpCounts.yes}</div>
            <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">Going</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Date</div>
            <div className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{new Date(event.date).toLocaleDateString()}</div>
          </div>
          <div className="border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Time</div>
            <div className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{[event.startTime, event.endTime].filter(Boolean).join(' - ') || 'TBD'}</div>
          </div>
          <div className="border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Location</div>
            <div className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{event.location || 'Chưa xác định'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-zinc-200 bg-white/90 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
          <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-zinc-950 dark:text-white mb-4">Your RSVP</h2>
          {myRsvp ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <span className="font-medium">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${myRsvp.status === 'yes' ? 'bg-green-100 text-green-800' :
                    myRsvp.status === 'no' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  {myRsvp.status === 'yes' ? '✅ Going' :
                    myRsvp.status === 'no' ? '❌ Not Going' :
                      '⚠️ Maybe'}
                </span>
              </div>

              <form action={rsvp} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change your response:</label>
                  <select name="status" className="w-full border border-zinc-300 bg-white p-3 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-950">
                    <option value="yes">✅ Going</option>
                    <option value="no">❌ Not Going</option>
                    <option value="maybe">⚠️ Maybe</option>
                  </select>
                </div>
                <button className="w-full border border-primary/40 bg-primary px-4 py-3 font-heading text-xs uppercase tracking-[0.14em] text-black transition-colors hover:bg-primary/90">
                  Update RSVP
                </button>
              </form>
            </div>
          ) : (
            <form action={rsvp} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Will you attend?</label>
                <select name="status" className="w-full border border-zinc-300 bg-white p-3 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-950">
                  <option value="yes">✅ Going</option>
                  <option value="no">❌ Not Going</option>
                  <option value="maybe">⚠️ Maybe</option>
                </select>
              </div>
              <button className="w-full border border-primary/40 bg-primary px-4 py-3 font-heading text-xs uppercase tracking-[0.14em] text-black transition-colors hover:bg-primary/90">
                Submit RSVP
              </button>
            </form>
          )}
        </div>

        <div className="border border-zinc-200 bg-white/90 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
          <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-zinc-950 dark:text-white mb-4">Attendance Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
              <span className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                Going
              </span>
              <span className="font-bold text-green-800">{rsvpCounts.yes}</span>
            </div>
            <div className="flex justify-between items-center border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <span className="flex items-center">
                <span className="text-red-600 mr-2">❌</span>
                Not Going
              </span>
              <span className="font-bold text-red-800">{rsvpCounts.no}</span>
            </div>
            <div className="flex justify-between items-center border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/30">
              <span className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                Maybe
              </span>
              <span className="font-bold text-yellow-800">{rsvpCounts.maybe}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Responses:</span>
                <span className="font-bold">{allRsvps.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

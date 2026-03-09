import { connectDB } from '@/lib/db'
import { User, IUser } from '@/models/User'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function MemberProfile(props: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await props.params
  const authUser = await getAuthUser()
  if (!authUser) redirect('/')
  await connectDB()
  const member = await User.findById(memberId).lean<IUser>()
  if (!member) return notFound()
  const canEdit = isAdmin(authUser?.role)
  async function updateMember(formData: FormData) {
    'use server'
    const authUser = await getAuthUser()
    if (!isAdmin(authUser?.role)) return
    await connectDB()
    const position = String(formData.get('position') || '')
    const phoneNumber = String(formData.get('phoneNumber') || '')
    await User.findByIdAndUpdate(memberId, { position, phoneNumber })
    revalidatePath(`/team/${memberId}`)
  }
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Member Profile</h1>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="font-medium">{member.name}</div>
        <div className="text-sm text-gray-600">{member.email}</div>
        <div className="text-sm text-gray-600">{member.position || '-'}</div>
        <div className="text-sm text-gray-600">{member.phoneNumber || '-'}</div>
      </div>
      {canEdit && (
        <form className="rounded-lg border bg-white p-4 shadow-sm" action={updateMember}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input name="position" placeholder="Position" defaultValue={member.position || ''} className="rounded border p-2" />
            <input name="phoneNumber" placeholder="Contact" defaultValue={member.phoneNumber || ''} className="rounded border p-2" />
          </div>
          <div className="mt-3">
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Save</button>
          </div>
        </form>
      )}
    </main>
  )
}

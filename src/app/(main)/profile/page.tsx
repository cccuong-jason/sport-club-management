import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { getAuthUser } from '@/lib/auth-user'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const authUser = await getAuthUser()
  if (!authUser) redirect('/')

  await connectDB()
  const user = await User.findOne({ clerkId: authUser.clerkId }).lean<any>()

  if (!user) return <div>User not found</div>

  const serializedUser = {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    dateOfBirth: user.dateOfBirth?.toISOString()
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>
      <ProfileForm user={serializedUser} />
    </main>
  )
}

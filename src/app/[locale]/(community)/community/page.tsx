import { getAuthUser } from "@/lib/auth-user"
import { connectDB } from "@/lib/db"
import { CommunityPost } from "@/models/CommunityPost"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { 
    Megaphone, ClipboardList, Star, UserPlus, 
    User as UserIcon, BarChart2, MessageSquare, MapPin 
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

const TypeIcons = {
    ANNOUNCEMENT: Megaphone,
    MATCH_REPORT: ClipboardList,
    PLAYER_SPOTLIGHT: Star,
    RECRUITMENT: UserPlus,
    PLAYER_LISTING: UserIcon,
    POLL: BarChart2,
    DISCUSSION: MessageSquare
}

export default async function CommunityFeedPage() {
    // The feed is public, but we want the user session if available to show "Create Post" eventually
    const user = await getAuthUser()
    const t = await getTranslations("Community")

    await connectDB()

    // Fetch public posts (limit 20 for now)
    const posts = await CommunityPost.find({ scope: 'public' })
        .populate('authorId', 'name photoUrl')
        .populate('clubId', 'name')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean<any[]>()

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {t('feedTitle') || 'Global Community Feed'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-sans">
                    {t('feedDescription') || 'Discover clubs, players, and matches near you.'}
                </p>
            </div>

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in">
                        <GlobeEmptyState />
                        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mt-4">
                            No posts to show yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                            Be the first to share an announcement, look for players, or discuss a match!
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard key={String(post._id)} post={post} />
                    ))
                )}
            </div>
        </div>
    )
}

function PostCard({ post }: { post: any }) {
    const Icon = TypeIcons[post.type as keyof typeof TypeIcons] || MessageSquare
    const locationString = post.location?.city ? `${post.location.city}, ${post.location.country}` : null

    return (
        <article className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                        {post.authorId?.photoUrl ? (
                            <Image src={post.authorId.photoUrl} alt="" width={40} height={40} className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon size={20} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {post.authorId?.name || 'Anonymous User'}
                            {post.clubId && (
                                <span className="text-primary text-sm font-normal bg-primary/10 px-2 py-0.5 rounded-full">
                                    {post.clubId.name}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                            {locationString && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {locationString}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                <div title={post.type} className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                    <Icon size={16} />
                </div>
            </div>

            <div className="text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap">
                {post.content}
            </div>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className={`mt-4 grid gap-2 ${post.mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} rounded-xl overflow-hidden`}>
                    {post.mediaUrls.map((url: string, index: number) => (
                        <div key={index} className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                            {/* Wait to replace with next/image after verifying standard sizes or use object-cover */}
                            <Image src={url} alt="Post Attachment" fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </article>
    )
}

function GlobeEmptyState() {
    return (
        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-700">
            <MessageSquare size={32} />
        </div>
    )
}

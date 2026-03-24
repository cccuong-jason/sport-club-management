import { SignUp } from '@clerk/nextjs'
import { AuthSetupNotice } from '@/components/auth/AuthSetupNotice'
import { isClerkConfigured } from '@/lib/clerk-env'

export default function Page() {
    if (!isClerkConfigured()) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
                <AuthSetupNotice mode="sign-up" />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <SignUp />
        </div>
    )
}

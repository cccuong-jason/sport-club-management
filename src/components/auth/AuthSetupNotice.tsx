import Link from 'next/link'

export function AuthSetupNotice({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const title = mode === 'sign-in' ? 'Sign in requires Clerk configuration' : 'Sign up requires Clerk configuration'

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-left shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-700">
        The app is running in fallback mode because Clerk environment variables are not set.
        Add real Clerk keys in your local env override to enable authentication flows inside the container.
      </p>
      <div className="mt-5 rounded-xl bg-white p-4 font-mono text-xs text-slate-700 shadow-sm">
        <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...</div>
        <div>CLERK_SECRET_KEY=sk_...</div>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        The landing page and container stack still work without these values.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        Back to home
      </Link>
    </div>
  )
}

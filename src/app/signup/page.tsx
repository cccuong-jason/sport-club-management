import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SignupForm } from './signup-form'

export default async function SignUpPage(props: { searchParams: Promise<{ email?: string }> }) {
  const searchParams = await props.searchParams
  const defaultEmail = searchParams?.email || ''

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <Card className="w-full max-w-md border-0 sm:border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Đăng Ký</CardTitle>
          <CardDescription className="text-center">Tạo tài khoản để quản lý đội bóng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm defaultEmail={defaultEmail} />
        </CardContent>
      </Card>
    </main>
  )
}

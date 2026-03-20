import { AppSidebar } from "@/components/app-sidebar"
import { getAuthUser } from "@/lib/auth-user"
import { redirect } from "next/navigation"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { NotificationCenter } from "@/components/notifications/NotificationCenter"
import { ModeToggle } from "@/components/mode-toggle"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (user?.status === 'onboarding') {
    redirect('/onboarding')
  }
  if (user?.status === 'pending_approval') {
    redirect('/onboarding/pending')
  }

  return (
    <SidebarProvider>
      <AppSidebar authUser={user!} />
      <SidebarInset className="bg-[radial-gradient(circle_at_top,_rgba(194,255,87,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,244,245,0.98))] dark:bg-[radial-gradient(circle_at_top,_rgba(194,255,87,0.16),_transparent_26%),linear-gradient(180deg,_rgba(9,9,11,0.96),_rgba(24,24,27,0.96))]">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/70 bg-white/85 px-4 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="font-heading text-[11px] uppercase tracking-[0.18em]">Club</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-heading text-[11px] uppercase tracking-[0.18em] text-zinc-500">Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <NotificationCenter />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

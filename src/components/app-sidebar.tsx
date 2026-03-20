"use client"

import * as React from "react"
import {
  ChevronUp,
  Trophy,
  LogOut,
  User
} from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { setClubContextAction } from "@/app/[locale]/(main)/settings/actions"
import { AuthUser, ClubMembership } from "@/lib/auth-user"
import { ChevronsUpDown, Check } from "lucide-react"
import { getPrimaryNavigationItems } from "@/lib/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar({ authUser }: { authUser: AuthUser }) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()

  const items = getPrimaryNavigationItems()

  // Helper to check active state
  const isActive = (url: string) => {
    if (url === '/dashboard') return pathname === url
    return pathname?.startsWith(url)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-none border border-zinc-800 bg-zinc-950/90 text-white data-[state=open]:bg-primary data-[state=open]:text-black"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-none border border-primary/30 bg-primary text-black">
                <Trophy className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading text-xs font-black uppercase tracking-[0.2em]">{authUser?.activeClubName || "No Club Selected"}</span>
                <span className="truncate text-[11px] uppercase tracking-[0.18em] text-zinc-400">{authUser?.activeClubSport || "Select a club"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Switch Club</div>
            {authUser.memberships.map((membership: ClubMembership) => (
              <DropdownMenuItem
                key={membership.clubId}
                onClick={() => setClubContextAction(membership.clubId)}
                className="flex items-center gap-2 cursor-pointer p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Trophy className="size-3 shrink-0" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold">{membership.clubName}</span>
                  <span className="text-xs text-muted-foreground capitalize">{membership.sport} • {membership.role}</span>
                </div>
                {membership.clubId === authUser.activeClubId && (
                  <Check className="size-4 text-primary ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-[11px] uppercase tracking-[0.22em] text-zinc-500">Command</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="rounded-none border border-transparent font-medium uppercase tracking-[0.08em] hover:border-zinc-800 hover:bg-zinc-950/70 hover:text-white data-[active=true]:border-primary/40 data-[active=true]:bg-primary data-[active=true]:text-black"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 rounded-none border border-zinc-800 bg-zinc-950/85 text-white">
                  <Avatar className="h-8 w-8 rounded-none border border-primary/20">
                    <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || ""} />
                    <AvatarFallback className="rounded-none bg-primary text-black">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.fullName}</span>
                    <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

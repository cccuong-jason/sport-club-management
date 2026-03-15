"use client"

import * as React from "react"
import {
  Calendar,
  ChevronUp,
  LayoutDashboard,
  Users,
  Wallet,
  Trophy,
  List,
  BarChart,
  LogOut,
  CreditCard,
  User
} from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { setClubContextAction } from "@/app/[locale]/(main)/settings/actions"
import { AuthUser, ClubMembership } from "@/lib/auth-user"
import { ChevronsUpDown, Check } from "lucide-react"
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

  const items = [
    { title: "Bảng điều khiển", url: "/dashboard", icon: LayoutDashboard },
    { title: "Đội bóng", url: "/team", icon: Users },
    { title: "Sự kiện", url: "/events", icon: Trophy },
    { title: "Mùa giải", url: "/seasons", icon: List },
    { title: "Lịch", url: "/calendar", icon: Calendar },
    { title: "Bình chọn", url: "/voting", icon: CreditCard },
    { title: "Quỹ", url: "/funds", icon: Wallet },
    { title: "Báo cáo", url: "/reports/attendance", icon: BarChart },
  ]

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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Trophy className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold uppercase">{authUser?.activeClubName || "No Club Selected"}</span>
                <span className="truncate text-xs capitalize">{authUser?.activeClubSport || "Select a club"}</span>
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
            <div className="text-xs font-medium text-slate-500 px-2 py-1.5 uppercase">Switch Club</div>
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
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
                <SidebarMenuButton className="h-12">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || ""} />
                    <AvatarFallback className="rounded-lg">
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

import {
  LayoutDashboard,
  Users,
  Trophy,
  List,
  Wallet,
} from 'lucide-react'

export function getPrimaryNavigationItems() {
  return [
    { title: 'Bảng điều khiển', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Đội bóng', url: '/team', icon: Users },
    { title: 'Sự kiện', url: '/events', icon: Trophy },
    { title: 'Mùa giải', url: '/seasons', icon: List },
    { title: 'Quỹ', url: '/funds', icon: Wallet },
  ]
}

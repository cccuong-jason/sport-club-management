'use client'

import { setRole, removeMember, setStatus, updateMemberDetails, requestLeaveClub, approveTransfer } from '@/app/[locale]/(main)/team/actions'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Crown, User, Shirt, CheckCircle, XCircle, AlertTriangle, Pencil, Clock, LogOut, CheckSquare } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface Props {
  member: any
  isAdmin: boolean
  currentUserId: string
}

export function MemberCard({ member, isAdmin, currentUserId }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleRoleChange = async (val: string) => {
    const fd = new FormData()
    fd.append('userId', member._id)
    fd.append('role', val)
    const result = await setRole(fd)
    if (result?.success) {
      toast.success(result.message)
    } else {
      toast.error(result?.message || 'Cập nhật vai trò thất bại')
    }
  }

  const handleStatusChange = async (val: string) => {
    const fd = new FormData()
    fd.append('userId', member._id)
    fd.append('status', val)
    const result = await setStatus(fd)
    if (result?.success) {
      toast.success(result.message)
    } else {
      toast.error(result?.message || 'Cập nhật trạng thái thất bại')
    }
  }

  const handleRemove = async () => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${member.name}?`)) {
      const result = await removeMember(member._id)
      if (result?.success) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Xóa thành viên thất bại')
      }
    }
  }

  const handleUpdateDetails = async (formData: FormData) => {
    const result = await updateMemberDetails(formData)
    if (result?.success) {
      toast.success(result.message)
      setIsEditOpen(false)
    } else {
      toast.error(result?.message || 'Cập nhật thông tin thất bại')
    }
  }

  const handleLeave = async () => {
    if (confirm(`Bạn có chắc chắn muốn rời câu lạc bộ không? Bạn phải đợi 7 ngày hoặc chờ Admin duyệt.`)) {
      const result = await requestLeaveClub()
      if (result?.success) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Yêu cầu rời đi thất bại')
      }
    }
  }

  const handleApproveTransfer = async () => {
    if (confirm(`Duyệt cho ${member.name} rời câu lạc bộ?`)) {
      const result = await approveTransfer(member._id)
      if (result?.success) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Duyệt thất bại')
      }
    }
  }

  const isSelf = member._id === currentUserId
  const isLeaving = member.status === 'leaving'

  return (
    <div className="flex flex-col gap-3 overflow-hidden p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <div className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary text-lg font-black text-black">
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <h3 className="truncate font-semibold text-zinc-950 dark:text-white">{member.name}</h3>
            <span className={`flex items-center gap-1 border px-2 py-0.5 text-xs font-medium uppercase tracking-[0.1em] ${member.role === 'admin'
              ? 'border-primary/30 bg-primary/10 text-zinc-900 dark:text-white'
              : 'border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }`}>
              {member.role === 'admin' ? <><Crown className="h-3 w-3" /> Quản trị viên</> : <><User className="h-3 w-3" /> Thành viên</>}
            </span>
            <span className={`flex items-center gap-1 border px-2 py-0.5 text-xs font-medium uppercase tracking-[0.1em] ${member.status === 'active' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300' :
              member.status === 'unavailable' ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300' :
                member.status === 'leaving' ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300' :
                  member.status === 'pending_approval' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300' :
                    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'
              }`}>
              {member.status === 'active' ? <CheckCircle className="h-3 w-3" /> :
                member.status === 'unavailable' ? <AlertTriangle className="h-3 w-3" /> :
                  member.status === 'leaving' ? <LogOut className="h-3 w-3" /> :
                    member.status === 'pending_approval' ? <Clock className="h-3 w-3" /> :
                      <XCircle className="h-3 w-3" />}
              <span className="capitalize">
                {member.status === 'active' ? 'Hoạt động' :
                  member.status === 'unavailable' ? 'Tạm vắng' :
                    member.status === 'leaving' ? 'Xin rời đội' :
                      member.status === 'pending_approval' ? 'Chờ duyệt' :
                        'Không hoạt động'}
              </span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{member.email}</p>
          {member.position && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><Shirt className="h-3 w-3" /> {member.position}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSelf && !isAdmin && !isLeaving && (
          <Button variant="outline" size="sm" onClick={handleLeave} className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
            <LogOut className="h-4 w-4 mr-2" /> Rời đội
          </Button>
        )}

        {isAdmin && isLeaving && (
          <Button size="sm" onClick={handleApproveTransfer} className="bg-orange-600 hover:bg-orange-700">
            <CheckSquare className="h-4 w-4 mr-2" /> Duyệt Rời Đội
          </Button>
        )}

        {isAdmin && (
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 flex-shrink-0">
            <div className="w-32">
              <Select defaultValue={member.status || 'active'} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending_approval">Chờ duyệt</SelectItem>
                  <SelectItem value="unavailable">Tạm vắng</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Select defaultValue={member.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Thành viên</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin cho {member.name}.
                  </DialogDescription>
                </DialogHeader>
                <form action={handleUpdateDetails}>
                  <input type="hidden" name="userId" value={member._id} />
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Tên
                      </Label>
                      <Input id="name" name="name" defaultValue={member.name} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" name="email" defaultValue={member.email} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="position" className="text-right">
                        Vị trí
                      </Label>
                      <Input id="position" name="position" defaultValue={member.position} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Lưu thay đổi</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

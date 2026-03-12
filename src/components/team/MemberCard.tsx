'use client'

import { setRole, removeMember, setStatus, updateMemberDetails, requestLeaveClub, approveTransfer } from '@/app/(main)/team/actions'
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 hover:bg-muted/50 transition-colors overflow-hidden">
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-800 text-white font-bold text-lg">
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <h3 className="font-semibold truncate">{member.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${member.role === 'admin'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-800'
              }`}>
              {member.role === 'admin' ? <><Crown className="h-3 w-3" /> Quản trị viên</> : <><User className="h-3 w-3" /> Thành viên</>}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${member.status === 'active' ? 'bg-green-100 text-green-800' :
              member.status === 'unavailable' ? 'bg-yellow-100 text-yellow-800' :
                member.status === 'leaving' ? 'bg-orange-100 text-orange-800' :
                  member.status === 'pending_approval' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
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

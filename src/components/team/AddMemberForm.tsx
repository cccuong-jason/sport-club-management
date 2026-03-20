'use client'

import { addMember } from '@/app/[locale]/(main)/team/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRef } from 'react'

export function AddMemberForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await addMember(formData)
    if (result?.success) {
      toast.success(result.message)
      formRef.current?.reset()
    } else {
      toast.error(result?.message || 'Thêm thành viên thất bại')
    }
  }

  return (
    <Card className="overflow-hidden rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
      <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
        <CardTitle className="font-heading text-2xl uppercase tracking-[0.08em]">Thêm thành viên mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input name="name" placeholder="Nhập họ và tên" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ Email *</Label>
              <Input name="email" type="email" placeholder="Nhập địa chỉ email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Vị trí (Tùy chọn)</Label>
              <Input name="position" placeholder="VD: Tiền đạo, Tiền vệ" />
            </div>
          </div>
          <Button type="submit">Thêm thành viên</Button>
        </form>
      </CardContent>
    </Card>
  )
}

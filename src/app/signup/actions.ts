'use server'

import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '@/lib/mailer'

export async function registerUser(prevState: any, formData: FormData) {
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!name || !email || !password) {
        return { success: false, message: 'Vui lòng điền đầy đủ thông tin' }
    }

    try {
        await connectDB()
        const existing = await User.findOne({ email })
        if (existing) {
            return { success: false, message: 'Email này đã được sử dụng' }
        }

        const passwordHash = await bcrypt.hash(password, 10)
        // Defaulting to 'admin' for now based on previous requirements for testing onboarding
        // In production, this might be 'member' or configurable
        await User.create({ name, email, passwordHash, role: 'admin' })

        try {
            await sendWelcomeEmail(email, name)
        } catch (error) {
            console.error('Failed to send welcome email:', error)
        }

        return { success: true, message: 'Đăng ký thành công' }
    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Đã có lỗi xảy ra' }
    }
}

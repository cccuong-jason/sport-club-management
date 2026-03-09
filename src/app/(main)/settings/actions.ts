"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function setClubContextAction(clubId: string) {
    const cookieStore = await cookies()
    cookieStore.set('active_club_context', clubId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

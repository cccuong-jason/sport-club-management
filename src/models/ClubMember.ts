import mongoose, { Schema, model } from 'mongoose'

const ClubMemberSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    status: { type: String, enum: ['active', 'inactive', 'pending_approval', 'leaving'], default: 'pending_approval' },
    leaveRequestedAt: { type: Date }
}, { timestamps: true })

// Ensure a user can only have one active/pending relationship per club
ClubMemberSchema.index({ userId: 1, clubId: 1 }, { unique: true })

export type IClubMember = {
    _id: string
    userId: string
    clubId: string
    role: 'admin' | 'member'
    status: 'active' | 'inactive' | 'pending_approval' | 'leaving'
    leaveRequestedAt?: Date
}

const Model = mongoose.models?.ClubMember || model('ClubMember', ClubMemberSchema)
export const ClubMember = Model

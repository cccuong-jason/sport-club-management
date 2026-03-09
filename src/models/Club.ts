import mongoose, { Schema, model } from 'mongoose'

const ClubSchema = new Schema({
    name: { type: String, required: true },
    sport: {
        type: String,
        enum: ['football', 'basketball', 'volleyball', 'tennis', 'other'],
        required: true
    },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inviteCode: { type: String, unique: true, sparse: true },
    isPublic: { type: Boolean, default: true },
    description: { type: String },
    logoUrl: { type: String }
}, { timestamps: true })

ClubSchema.index({ name: 'text' })

export type IClub = {
    _id: string
    name: string
    sport: 'football' | 'basketball' | 'volleyball' | 'tennis' | 'other'
    adminId: string
    inviteCode?: string
    isPublic: boolean
    description?: string
    logoUrl?: string
}

const Model = mongoose.models?.Club || model('Club', ClubSchema)
export const Club = Model

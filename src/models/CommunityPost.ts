import mongoose, { Schema, model } from 'mongoose'

const CommunityPostSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club' },
    type: { 
        type: String, 
        enum: ['ANNOUNCEMENT', 'MATCH_REPORT', 'PLAYER_SPOTLIGHT', 'RECRUITMENT', 'PLAYER_LISTING', 'POLL', 'DISCUSSION'],
        required: true 
    },
    scope: { type: String, enum: ['club', 'public'], default: 'public' },
    content: { type: String, required: true },
    mediaUrls: [{ type: String }],
    location: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        city: String,
        country: String
    },
    metadata: { type: Schema.Types.Mixed } // For poll options, recruitment positions, etc.
}, { timestamps: true })

CommunityPostSchema.index({ createdAt: -1, scope: 1 })
CommunityPostSchema.index({ 'location.city': 1, 'location.country': 1 })

export type ICommunityPost = {
    _id: string
    authorId: string | any
    clubId?: string | any
    type: 'ANNOUNCEMENT' | 'MATCH_REPORT' | 'PLAYER_SPOTLIGHT' | 'RECRUITMENT' | 'PLAYER_LISTING' | 'POLL' | 'DISCUSSION'
    scope: 'club' | 'public'
    content: string
    mediaUrls?: string[]
    location?: {
        coordinates: { lat: number, lng: number }
        city: string
        country: string
    }
    metadata?: any
    createdAt: Date
    updatedAt: Date
}

const Model = mongoose.models?.CommunityPost || model('CommunityPost', CommunityPostSchema)
export const CommunityPost = Model

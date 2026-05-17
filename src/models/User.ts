import mongoose, { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  clerkId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: String,
  phoneNumber: String,
  dateOfBirth: Date,
  citizenId: String,
  photoUrl: String,
  passwordHash: String,
  publicLocation: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    city: String,
    country: String
  },
  onboardingCompleted: { type: Boolean, default: false },
}, { timestamps: true })

export type IUser = {
  _id: string
  clerkId?: string
  name: string
  email: string
  position?: string
  phoneNumber?: string
  dateOfBirth?: Date
  citizenId?: string
  photoUrl?: string
  publicLocation?: {
    coordinates?: {
      lat?: number
      lng?: number
    }
    city?: string
    country?: string
  }
  onboardingCompleted?: boolean
}

const Model = mongoose.models?.User || model('User', UserSchema)
export const User = Model

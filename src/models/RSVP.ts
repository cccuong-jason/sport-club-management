import { Schema, model, models } from 'mongoose'

const RSVPSchema = new Schema({
  clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['yes', 'no', 'maybe'], required: true },
  note: String
}, { timestamps: true })

RSVPSchema.index({ eventId: 1, userId: 1 }, { unique: true })

const Model = models?.RSVP || model('RSVP', RSVPSchema)
export const RSVP = Model

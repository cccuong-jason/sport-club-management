import { Schema, model, models } from 'mongoose'

const TeamSchema = new Schema({
  name: { type: String, required: true },
  managerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sport: {
    type: String,
    required: true,
    enum: ['Football', 'Futsal', 'Basketball', 'Volleyball', 'Badminton', 'Tennis', 'Other']
  },
  currency: { type: String, default: 'VND' },
  language: { type: String, enum: ['vi', 'en'], default: 'vi' },
  logoUrl: String,
  themeColor: String,
}, { timestamps: true })

const Model = models?.Team || model('Team', TeamSchema)
export const Team = Model

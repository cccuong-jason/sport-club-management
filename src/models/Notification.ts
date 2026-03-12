import { Schema, model, models } from 'mongoose'

const NotificationSchema = new Schema({
  clubId: { type: Schema.Types.ObjectId, ref: 'Club' }, // Optional because some notifications might be system-wide
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'info', 'success', 'warning'
  message: { type: String, required: true },
  link: String,
  read: { type: Boolean, default: false },
}, { timestamps: true })

// Index for efficient querying by user and sort by date
NotificationSchema.index({ recipientId: 1, createdAt: -1 })

const Model = models?.Notification || model('Notification', NotificationSchema)
export const Notification = Model

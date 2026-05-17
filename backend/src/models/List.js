import mongoose from 'mongoose'

const listSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  isPublic:    { type: Boolean, default: false },
  items:       [{ type: Object }],
}, { timestamps: true })

export default mongoose.model('List', listSchema)

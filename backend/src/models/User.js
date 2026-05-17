import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },
  favorites:   [{ type: Object }],
  watchlist:   [{ type: Object }],
  createdAt:   { type: Date, default: Date.now },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

userSchema.methods.toPublic = function () {
  return { _id: this._id, username: this.username, email: this.email, avatar: this.avatar, createdAt: this.createdAt }
}

export default mongoose.model('User', userSchema)

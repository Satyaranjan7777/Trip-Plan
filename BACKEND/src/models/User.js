const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)



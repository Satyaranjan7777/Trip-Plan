const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (user) => {
  return jwt.sign({ _id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  })
}

const register = async (req, res) => {
  const { name, email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const passwordHash = await bcryptjs.hash(password, 10)

    const user = await User.create({ name, email, password: passwordHash })
    const token = signToken(user)

    return res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } })
  } catch (e) {
    return res.status(500).json({ message: 'Registration failed' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const ok = await bcryptjs.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user)
    return res.json({ token, user: { _id: user._id, name: user.name, email: user.email } })
  } catch (e) {
    return res.status(500).json({ message: 'Login failed' })
  }
}

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('name email')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ user: { _id: user._id, name: user.name, email: user.email } })
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load user' })
  }
}

module.exports = {
  login,
  register,
  me,
}



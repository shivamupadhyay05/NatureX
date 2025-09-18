const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const User = require('../models/User')

const signupSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
	role: z.enum(['student', 'teacher', 'admin']),
})

router.post('/signup', async (req, res) => {
	try {
		const data = signupSchema.parse(req.body)
		const existing = await User.findOne({ email: data.email })
		if (existing) return res.status(409).json({ error: 'Email already used' })
		const passwordHash = await bcrypt.hash(data.password, 10)
		const user = await User.create({ name: data.name, email: data.email, passwordHash, role: data.role })
		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
		res.json({ token, user: { id: user._id, role: user.role, name: user.name } })
	} catch (e) {
		if (e.name === 'ZodError') return res.status(400).json({ error: e.issues[0].message })
		res.status(500).json({ error: 'Signup failed' })
	}
})

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

router.post('/login', async (req, res) => {
	try {
		const { email, password } = loginSchema.parse(req.body)
		const user = await User.findOne({ email })
		if (!user) return res.status(401).json({ error: 'Invalid credentials' })
		const ok = await bcrypt.compare(password, user.passwordHash)
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
		res.json({ token, user: { id: user._id, role: user.role, name: user.name } })
	} catch (e) {
		if (e.name === 'ZodError') return res.status(400).json({ error: e.issues[0].message })
		res.status(500).json({ error: 'Login failed' })
	}
})

module.exports = router


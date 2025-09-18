const router = require('express').Router()
const { authenticate, authorize } = require('../middleware/auth')
const Lesson = require('../models/Lesson')
const Quiz = require('../models/Quiz')
const Mission = require('../models/Mission')

// Public listings
router.get('/lessons', async (req, res) => {
	const items = await Lesson.find().sort('-createdAt').limit(50)
	res.json(items)
})
router.get('/lessons/:id', async (req, res) => {
	const item = await Lesson.findById(req.params.id)
	if (!item) return res.status(404).json({ error: 'Lesson not found' })
	res.json(item)
})
router.get('/quizzes', async (req, res) => {
	const items = await Quiz.find().sort('-createdAt').limit(50)
	res.json(items)
})
router.get('/quizzes/:id', async (req, res) => {
	const item = await Quiz.findById(req.params.id)
	if (!item) return res.status(404).json({ error: 'Quiz not found' })
	res.json(item)
})
router.get('/missions', async (req, res) => {
	const items = await Mission.find().sort('-createdAt').limit(50)
	res.json(items)
})
router.get('/missions/:id', async (req, res) => {
	const item = await Mission.findById(req.params.id)
	if (!item) return res.status(404).json({ error: 'Mission not found' })
	res.json(item)
})

// Admin CMS endpoints
router.post('/lessons', authenticate, authorize(['admin']), async (req, res) => {
	const created = await Lesson.create(req.body)
	res.status(201).json(created)
})
router.post('/quizzes', authenticate, authorize(['admin']), async (req, res) => {
	const created = await Quiz.create(req.body)
	res.status(201).json(created)
})
router.post('/missions', authenticate, authorize(['admin']), async (req, res) => {
	const created = await Mission.create(req.body)
	res.status(201).json(created)
})

module.exports = router


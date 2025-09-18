const router = require('express').Router()
const User = require('../models/User')

router.get('/', async (req, res) => {
	const top = await User.find({}, { name: 1, xp: 1, role: 1 }).sort({ xp: -1 }).limit(50)
	res.json(top)
})

module.exports = router


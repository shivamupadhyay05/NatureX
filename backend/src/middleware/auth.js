const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
	const header = req.headers.authorization || ''
	const token = header.startsWith('Bearer ') ? header.slice(7) : null
	if (!token) return res.status(401).json({ error: 'Unauthorized' })
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		req.user = payload
		next()
	} catch (e) {
		res.status(401).json({ error: 'Invalid token' })
	}
}

function authorize(roles = []) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
		if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
		next()
	}
}

module.exports = { authenticate, authorize }


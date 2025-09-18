import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../App'
import api from '../../shared/api'
import { useTranslation } from 'react-i18next'

export function Login() {
	const [role, setRole] = useState('student')
	const [err, setErr] = useState('')
	const { setUser } = useAuth()
	const navigate = useNavigate()
	const { t } = useTranslation()

	async function onSubmit(e) {
		e.preventDefault()
		setErr('')
		try {
			const res = await api.post('/auth/login', { email: e.target[0].value, password: e.target[1].value })
			localStorage.setItem('nx_token', res.data.token)
			const nextRole = res.data.user.role
			setUser({ id: res.data.user.id, role: nextRole, name: res.data.user.name })
			navigate(`/${nextRole}`)
		} catch (e) {
			setErr(e?.response?.data?.error || 'Login failed')
		}
	}

	return (
		<form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4">
			<h2 className="text-2xl font-semibold">{t('login')}</h2>
			{err && <div className="text-sm text-red-400">{err}</div>}
			<input className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800" placeholder="Email" required />
			<input type="password" className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800" placeholder="Password" required />
			<select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800">
				<option value="student">{t('student')}</option>
				<option value="teacher">{t('teacher')}</option>
				<option value="admin">{t('admin')}</option>
			</select>
			<button className="w-full px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white">{t('login')}</button>
		</form>
	)
}

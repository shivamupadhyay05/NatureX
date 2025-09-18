import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../shared/api'

export function Quizzes() {
    const [items, setItems] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        api.get('/content/quizzes').then(res => setItems(res.data)).catch(() => setError('Failed to load'))
    }, [])
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Quizzes</h2>
            <p className="text-neutral-400">Test your knowledge and earn XP points</p>
            {!items && !error && <div className="text-sm text-neutral-400">Loading…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {items && (
                <div className="grid md:grid-cols-2 gap-6">
                    {items.map(q => (
                        <div key={q._id} className="rounded-lg border border-neutral-800 p-6 bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                            <div className="font-semibold text-lg mb-2">{q.title}</div>
                            <div className="text-sm text-neutral-400 capitalize mb-4">{q.category} • {q.questions?.length || 0} Questions • {q.xp} XP</div>
                            <div className="text-sm text-neutral-300 mb-4">
                                {q.category === 'climate' && 'Test your understanding of climate change, greenhouse gases, and environmental impacts.'}
                                {q.category === 'waste' && 'Quiz yourself on waste management, recycling, and sustainable practices.'}
                                {q.category === 'pollution' && 'Check your knowledge about different types of pollution and their effects.'}
                                {q.category === 'biodiversity' && 'Learn about ecosystems, species conservation, and environmental balance.'}
                            </div>
                            <Link 
                                to={`/quiz/${q._id}`}
                                className="inline-block px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                            >
                                Start Quiz
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

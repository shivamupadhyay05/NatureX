import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../shared/api'

export function Lessons() {
    const [items, setItems] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        api.get('/content/lessons').then(res => setItems(res.data)).catch(() => setError('Failed to load'))
    }, [])
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Lessons</h2>
            <p className="text-neutral-400">Learn about environmental topics and earn XP points</p>
            {!items && !error && <div className="text-sm text-neutral-400">Loading…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {items && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(l => (
                        <div key={l._id} className="rounded-lg border border-neutral-800 p-6 bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                            <div className="font-semibold text-lg mb-2">{l.title}</div>
                            <div className="text-sm text-neutral-400 capitalize mb-4">{l.category} • {l.xp} XP</div>
                            <div className="text-sm text-neutral-300 mb-4">
                                {l.category === 'pollution' && 'Learn about different types of pollution and their effects on the environment.'}
                                {l.category === 'biodiversity' && 'Discover the importance of biodiversity and threats to ecosystems.'}
                                {l.category === 'climate' && 'Understand climate change causes, effects, and solutions.'}
                                {l.category === 'waste' && 'Explore waste management strategies and recycling practices.'}
                            </div>
                            <Link 
                                to={`/lesson/${l._id}`}
                                className="inline-block px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                            >
                                Start Lesson
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

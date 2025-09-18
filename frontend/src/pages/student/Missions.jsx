import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../shared/api'

export function Missions() {
    const [items, setItems] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        api.get('/content/missions').then(res => setItems(res.data)).catch(() => setError('Failed to load'))
    }, [])
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Missions</h2>
            <p className="text-neutral-400">Complete real-world and digital challenges to earn XP</p>
            {!items && !error && <div className="text-sm text-neutral-400">Loading…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {items && (
                <div className="grid md:grid-cols-2 gap-6">
                    {items.map(m => (
                        <div key={m._id} className="rounded-lg border border-neutral-800 p-6 bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                {m.type === 'real-world' && <span className="text-2xl">🌍</span>}
                                {m.type === 'habit' && <span className="text-2xl">🔄</span>}
                                {m.type === 'digital' && <span className="text-2xl">💻</span>}
                                <div className="font-semibold text-lg">{m.title}</div>
                            </div>
                            <div className="text-sm text-neutral-400 capitalize mb-3">{m.type} • {m.xp} XP</div>
                            <div className="text-sm text-neutral-300 mb-4">{m.description}</div>
                            <Link 
                                to={`/mission/${m._id}`}
                                className="inline-block px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                            >
                                View Mission
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

import { useEffect, useState } from 'react'
import api from '../../shared/api'

export function Leaderboard() {
    const [rows, setRows] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        api.get('/leaderboard').then(res => setRows(res.data)).catch(() => setError('Failed to load'))
    }, [])
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Leaderboard</h2>
            {!rows && !error && <div className="text-sm text-neutral-400">Loading…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {rows && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-neutral-400">
                                <th className="py-2 pr-4">Rank</th>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">XP</th>
                            </tr>
                        </thead>
						
                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={r._id || idx} className="border-t border-neutral-800">
                                    <td className="py-2 pr-4">{idx + 1}</td>
                                    <td className="py-2 pr-4">{r.name}</td>
                                    <td className="py-2 pr-4">{r.xp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

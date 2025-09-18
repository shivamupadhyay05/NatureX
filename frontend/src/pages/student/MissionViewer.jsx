import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../shared/api'

export function MissionViewer() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [mission, setMission] = useState(null)
	const [loading, setLoading] = useState(true)
	const [joined, setJoined] = useState(false)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		api.get(`/content/missions/${id}`).then(res => {
			setMission(res.data)
			setLoading(false)
		}).catch(() => {
			setLoading(false)
		})
	}, [id])

	function handleJoin() {
		setJoined(true)
		// In real app, this would create a user mission record
	}

	function updateProgress() {
		setProgress(prev => Math.min(prev + 25, 100))
	}

	if (loading) return <div className="text-center py-8">Loading mission...</div>
	if (!mission) return <div className="text-center py-8 text-red-400">Mission not found</div>

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<button onClick={() => navigate('/missions')} className="text-emerald-400 hover:text-emerald-300">← Back to Missions</button>
			
			<div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
				<h1 className="text-3xl font-bold mb-4">{mission.title}</h1>
				<div className="text-sm text-neutral-400 mb-6 capitalize">
					{mission.type} • {mission.xp} XP
				</div>
				
				<div className="space-y-6">
					<div>
						<h3 className="text-xl font-semibold mb-3">Mission Description</h3>
						<p className="text-neutral-300 leading-relaxed">{mission.description}</p>
					</div>

					{mission.type === 'real-world' && (
						<div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
							<h4 className="font-semibold text-blue-300 mb-2">🌍 Real-World Mission</h4>
							<p className="text-sm text-neutral-300">
								This mission requires you to take action in the real world. Complete the task and submit evidence to earn XP.
							</p>
						</div>
					)}

					{mission.type === 'habit' && (
						<div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
							<h4 className="font-semibold text-green-300 mb-2">🔄 Habit Building</h4>
							<p className="text-sm text-neutral-300">
								This mission helps you build sustainable habits. Track your progress daily to complete the mission.
							</p>
						</div>
					)}

					{mission.type === 'digital' && (
						<div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
							<h4 className="font-semibold text-purple-300 mb-2">💻 Digital Mission</h4>
							<p className="text-sm text-neutral-300">
								This mission can be completed online. Follow the instructions to complete the digital task.
							</p>
						</div>
					)}

					{joined && (
						<div className="space-y-4">
							<div>
								<h4 className="font-semibold mb-2">Progress</h4>
								<div className="w-full bg-neutral-800 rounded-full h-3">
									<div 
										className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
										style={{ width: `${progress}%` }}
									></div>
								</div>
								<div className="text-sm text-neutral-400 mt-1">{progress}% Complete</div>
							</div>

							<div className="flex gap-3">
								<button 
									onClick={updateProgress}
									className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
								>
									Update Progress
								</button>
								{progress === 100 && (
									<button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg">
										Complete Mission (+{mission.xp} XP)
									</button>
								)}
							</div>
						</div>
					)}

					{!joined && (
						<button 
							onClick={handleJoin}
							className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
						>
							Join Mission
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

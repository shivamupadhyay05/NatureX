import { Link } from 'react-router-dom'

export function StudentDashboard() {
	return (
		<div className="space-y-6">
			<div className="grid sm:grid-cols-3 gap-4">
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">XP</div><div className="text-2xl font-bold">1,250</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Level</div><div className="text-2xl font-bold">7</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Badges</div><div className="text-2xl font-bold">5</div></div>
			</div>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
					<h3 className="font-semibold mb-2">Recent Activities</h3>
					<ul className="text-sm text-neutral-300 list-disc ml-5 space-y-1">
						<li>Completed Climate Change Quiz</li>
						<li>Joined Tree Plantation Mission</li>
						<li>Unlocked Eco Warrior badge</li>
					</ul>
				</div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
					<h3 className="font-semibold mb-2">Quick Links</h3>
					<div className="flex flex-wrap gap-2">
						<Link to="/lessons" className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white">Lessons</Link>
						<Link to="/quizzes" className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700">Quizzes</Link>
						<Link to="/missions" className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700">Missions</Link>
						<Link to="/rewards" className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700">Rewards</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export function TeacherDashboard() {
	return (
		<div className="space-y-6">
			<div className="grid sm:grid-cols-3 gap-4">
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Active Classes</div><div className="text-2xl font-bold">4</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Avg Score</div><div className="text-2xl font-bold">78%</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Missions Assigned</div><div className="text-2xl font-bold">12</div></div>
			</div>
			<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
				<h3 className="font-semibold mb-2">Recent Submissions</h3>
				<ul className="text-sm text-neutral-300 list-disc ml-5 space-y-1">
					<li>Class 8A - Climate Quiz</li>
					<li>Class 9B - Waste Segregation Mission</li>
				</ul>
			</div>
		</div>
	)
}

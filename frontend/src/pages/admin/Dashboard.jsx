export function AdminDashboard() {
	return (
		<div className="space-y-6">
			<div className="grid sm:grid-cols-4 gap-4">
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Users</div><div className="text-2xl font-bold">1,240</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Institutions</div><div className="text-2xl font-bold">42</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Engagement</div><div className="text-2xl font-bold">65%</div></div>
				<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900"><div className="text-xs text-neutral-400">Missions</div><div className="text-2xl font-bold">87</div></div>
			</div>
			<div className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
				<h3 className="font-semibold mb-2">Recent Content Updates</h3>
				<ul className="text-sm text-neutral-300 list-disc ml-5 space-y-1">
					<li>Added Quiz: Plastic Pollution</li>
					<li>Updated Lesson: Biodiversity Basics</li>
				</ul>
			</div>
		</div>
	)
}

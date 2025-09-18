export function Rewards() {
	const badges = [
		{ id: 1, name: 'Eco Warrior', desc: 'Complete 3 missions' },
		{ id: 2, name: 'Green Leader', desc: 'Reach level 10' },
	]
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Rewards & Badges</h2>
			<div className="grid sm:grid-cols-2 gap-4">
				{badges.map(b => (
					<div key={b.id} className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">
						<div className="font-semibold">{b.name}</div>
						<div className="text-xs text-neutral-400">{b.desc}</div>
					</div>
				))}
			</div>
		</div>
	)
}

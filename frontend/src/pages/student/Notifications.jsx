export function Notifications() {
	const items = [
		{ id: 1, text: 'New mission: Beach Cleanup this Saturday!' },
		{ id: 2, text: 'Reminder: Complete Biodiversity lesson' },
	]
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Notifications</h2>
			<ul className="space-y-2">
				{items.map(n => (
					<li key={n.id} className="rounded-lg border border-neutral-800 p-4 bg-neutral-900">{n.text}</li>
				))}
			</ul>
		</div>
	)
}

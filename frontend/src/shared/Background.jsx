export function Background() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute -inset-[40%] bg-[conic-gradient(at_top_left,_oklch(0.22_0.06_160)_0deg,_oklch(0.25_0.08_210)_140deg,_oklch(0.2_0.05_260)_220deg,_oklch(0.22_0.06_160)_360deg)] opacity-40 blur-3xl animate-[spin_30s_linear_infinite]" />
			<div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,_rgba(16,185,129,0.15),_transparent_70%),radial-gradient(40%_30%_at_80%_20%,_rgba(56,189,248,0.12),_transparent_70%)]" />
		</div>
	)
}


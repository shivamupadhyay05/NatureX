import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Background } from '../shared/Background'

export function Landing() {
	const { t } = useTranslation()
	return (
		<div className="relative">
			<Background />
			<section className="grid lg:grid-cols-2 gap-10 items-center">
				<div className="space-y-6">
					<div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/10 px-3 py-1 text-emerald-300 text-xs">Nature education • Gamified</div>
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
						<span className="bg-gradient-to-b from-emerald-200 to-emerald-600 bg-clip-text text-transparent">{t('welcomeHeadline')}</span>
					</h1>
					<p className="text-neutral-300 text-lg">Earn XP, badges, and climb the leaderboard while learning about climate, biodiversity, pollution, and waste.</p>
					<div className="flex gap-3">
						<Link to="/signup" className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition">{t('getStarted')}</Link>
						<Link to="/leaderboard" className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-800/60">{t('leaderboard')}</Link>
					</div>
				</div>
				<div className="aspect-[16/11] rounded-2xl border border-neutral-800 bg-gradient-to-br from-emerald-900/20 to-blue-900/20 backdrop-blur relative overflow-hidden">
					<div className="absolute inset-0 opacity-20">
						<div className="absolute top-4 left-4 w-2 h-2 bg-emerald-400 rounded-full"></div>
						<div className="absolute top-12 right-8 w-1 h-1 bg-emerald-300 rounded-full"></div>
						<div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
						<div className="absolute bottom-16 right-4 w-1 h-1 bg-emerald-400 rounded-full"></div>
						<div className="absolute top-20 left-1/2 w-1 h-1 bg-emerald-300 rounded-full"></div>
					</div>
					<div className="relative h-full flex flex-col items-center justify-center p-8">
						<div className="text-8xl mb-4 animate-bounce">🌱</div>
						<div className="text-6xl mb-4 animate-pulse">🌍</div>
						<div className="text-7xl mb-4 animate-pulse delay-1000">♻️</div>
						<div className="text-center">
							<div className="text-emerald-300 font-semibold mb-2">Interactive Learning</div>
							<div className="text-neutral-400 text-sm">Earn XP • Complete Missions • Climb Leaderboards</div>
						</div>
					</div>
				</div>
			</section>
			
			<section className="mt-20 space-y-12">
				<div className="text-center">
					<h2 className="text-3xl font-bold mb-4">Why Choose NatureX?</h2>
					<p className="text-neutral-400 max-w-2xl mx-auto">Learn environmental science through gamification, earn rewards, and make a real impact.</p>
				</div>
				
				<div className="grid md:grid-cols-3 gap-8">
					<div className="text-center space-y-4">
						<div className="text-5xl">📚</div>
						<h3 className="text-xl font-semibold">Interactive Lessons</h3>
						<p className="text-neutral-400 text-sm">Learn about pollution, biodiversity, climate change, and waste management through engaging content.</p>
					</div>
					<div className="text-center space-y-4">
						<div className="text-5xl">🎯</div>
						<h3 className="text-xl font-semibold">Real-World Missions</h3>
						<p className="text-neutral-400 text-sm">Complete actual environmental challenges like tree planting and waste segregation to earn XP.</p>
					</div>
					<div className="text-center space-y-4">
						<div className="text-5xl">🏆</div>
						<h3 className="text-xl font-semibold">Gamified Learning</h3>
						<p className="text-neutral-400 text-sm">Earn badges, climb leaderboards, and unlock achievements as you learn and contribute.</p>
					</div>
				</div>
			</section>
		</div>
	)
}

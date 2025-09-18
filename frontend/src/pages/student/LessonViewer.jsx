import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../shared/api'

export function LessonViewer() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)
	const [completed, setCompleted] = useState(false)

	useEffect(() => {
		api.get(`/content/lessons/${id}`).then(res => {
			setLesson(res.data)
			setLoading(false)
		}).catch(() => {
			setLoading(false)
		})
	}, [id])

	function handleComplete() {
		setCompleted(true)
		// In real app, this would award XP and update progress
	}

	if (loading) return <div className="text-center py-8">Loading lesson...</div>
	if (!lesson) return <div className="text-center py-8 text-red-400">Lesson not found</div>

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<button onClick={() => navigate('/lessons')} className="text-emerald-400 hover:text-emerald-300">← Back to Lessons</button>
			
			<div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
				<h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
				<div className="text-sm text-neutral-400 mb-6 capitalize">
					{lesson.category} • {lesson.xp} XP
				</div>
				
				<div className="prose prose-invert max-w-none">
					<div className="text-lg leading-relaxed space-y-4">
						{lesson.category === 'pollution' && (
							<>
								<p>Pollution is the introduction of harmful materials into the environment. These harmful materials are called pollutants.</p>
								<h3 className="text-xl font-semibold mt-6">Types of Pollution</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li><strong>Air Pollution:</strong> Caused by vehicles, factories, and burning fossil fuels</li>
									<li><strong>Water Pollution:</strong> Contamination of water bodies by chemicals, waste, and sewage</li>
									<li><strong>Soil Pollution:</strong> Contamination of soil by chemicals, pesticides, and waste</li>
									<li><strong>Noise Pollution:</strong> Excessive noise from traffic, construction, and industrial activities</li>
								</ul>
								<h3 className="text-xl font-semibold mt-6">Effects of Pollution</h3>
								<p>Pollution affects human health, wildlife, and the environment. It can cause respiratory diseases, waterborne illnesses, and ecosystem damage.</p>
								<h3 className="text-xl font-semibold mt-6">Solutions</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li>Use renewable energy sources</li>
									<li>Reduce, reuse, and recycle</li>
									<li>Use public transportation</li>
									<li>Support clean technology</li>
								</ul>
							</>
						)}
						
						{lesson.category === 'biodiversity' && (
							<>
								<p>Biodiversity refers to the variety of life on Earth, including all plants, animals, and microorganisms.</p>
								<h3 className="text-xl font-semibold mt-6">Types of Biodiversity</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li><strong>Genetic Diversity:</strong> Variation within species</li>
									<li><strong>Species Diversity:</strong> Variety of different species</li>
									<li><strong>Ecosystem Diversity:</strong> Variety of ecosystems and habitats</li>
								</ul>
								<h3 className="text-xl font-semibold mt-6">Why Biodiversity Matters</h3>
								<p>Biodiversity provides ecosystem services like clean air, water, food, and medicine. It also helps ecosystems adapt to changes.</p>
								<h3 className="text-xl font-semibold mt-6">Threats to Biodiversity</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li>Habitat destruction</li>
									<li>Climate change</li>
									<li>Pollution</li>
									<li>Overexploitation</li>
									<li>Invasive species</li>
								</ul>
							</>
						)}
						
						{lesson.category === 'climate' && (
							<>
								<p>Climate change refers to long-term shifts in global temperatures and weather patterns.</p>
								<h3 className="text-xl font-semibold mt-6">Causes of Climate Change</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li><strong>Greenhouse Gases:</strong> CO2, methane, and other gases trap heat</li>
									<li><strong>Human Activities:</strong> Burning fossil fuels, deforestation, agriculture</li>
									<li><strong>Natural Factors:</strong> Volcanic eruptions, solar radiation changes</li>
								</ul>
								<h3 className="text-xl font-semibold mt-6">Effects of Climate Change</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li>Rising sea levels</li>
									<li>Extreme weather events</li>
									<li>Ocean acidification</li>
									<li>Ecosystem disruption</li>
									<li>Food security threats</li>
								</ul>
								<h3 className="text-xl font-semibold mt-6">What We Can Do</h3>
								<ul className="list-disc ml-6 space-y-2">
									<li>Reduce carbon footprint</li>
									<li>Use renewable energy</li>
									<li>Support climate policies</li>
									<li>Plant trees</li>
									<li>Educate others</li>
								</ul>
							</>
						)}
					</div>
				</div>
				
				{!completed ? (
					<button 
						onClick={handleComplete}
						className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
					>
						Complete Lesson (+{lesson.xp} XP)
					</button>
				) : (
					<div className="mt-8 p-4 bg-emerald-900/20 border border-emerald-700 rounded-lg">
						<div className="text-emerald-400 font-semibold">✅ Lesson Completed!</div>
						<div className="text-sm text-neutral-400">You earned {lesson.xp} XP</div>
					</div>
				)}
			</div>
		</div>
	)
}

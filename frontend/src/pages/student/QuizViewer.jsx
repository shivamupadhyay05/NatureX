import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../shared/api'

export function QuizViewer() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [quiz, setQuiz] = useState(null)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [selectedAnswers, setSelectedAnswers] = useState({})
	const [score, setScore] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		api.get(`/content/quizzes/${id}`).then(res => {
			setQuiz(res.data)
			setLoading(false)
		}).catch(() => {
			setLoading(false)
		})
	}, [id])

	function handleAnswerSelect(questionIndex, answerIndex) {
		setSelectedAnswers(prev => ({
			...prev,
			[questionIndex]: answerIndex
		}))
	}

	function calculateScore() {
		if (!quiz) return 0
		let correct = 0
		quiz.questions.forEach((q, index) => {
			if (selectedAnswers[index] === q.answerIndex) {
				correct++
			}
		})
		return Math.round((correct / quiz.questions.length) * 100)
	}

	function submitQuiz() {
		const finalScore = calculateScore()
		setScore(finalScore)
	}

	function nextQuestion() {
		if (currentQuestion < quiz.questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
		}
	}

	function prevQuestion() {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1)
		}
	}

	if (loading) return <div className="text-center py-8">Loading quiz...</div>
	if (!quiz) return <div className="text-center py-8 text-red-400">Quiz not found</div>

	if (score !== null) {
		return (
			<div className="max-w-2xl mx-auto text-center space-y-6">
				<button onClick={() => navigate('/quizzes')} className="text-emerald-400 hover:text-emerald-300">← Back to Quizzes</button>
				
				<div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800">
					<div className="text-6xl mb-4">
						{score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
					</div>
					<h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
					<div className="text-4xl font-bold text-emerald-400 mb-2">{score}%</div>
					<div className="text-neutral-400 mb-6">
						{score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep studying!'}
					</div>
					<div className="text-sm text-neutral-500">
						You answered {Object.keys(selectedAnswers).length} out of {quiz.questions.length} questions
					</div>
					<button 
						onClick={() => navigate('/quizzes')}
						className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
					>
						Back to Quizzes
					</button>
				</div>
			</div>
		)
	}

	const question = quiz.questions[currentQuestion]
	const isLastQuestion = currentQuestion === quiz.questions.length - 1
	const allAnswered = Object.keys(selectedAnswers).length === quiz.questions.length

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<button onClick={() => navigate('/quizzes')} className="text-emerald-400 hover:text-emerald-300">← Back to Quizzes</button>
			
			<div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">{quiz.title}</h1>
					<div className="text-sm text-neutral-400">
						Question {currentQuestion + 1} of {quiz.questions.length}
					</div>
				</div>

				<div className="mb-6">
					<div className="w-full bg-neutral-800 rounded-full h-2">
						<div 
							className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
							style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
						></div>
					</div>
				</div>

				<div className="space-y-6">
					<div>
						<h2 className="text-xl font-semibold mb-4">{question.q}</h2>
						<div className="space-y-3">
							{question.options.map((option, index) => (
								<label key={index} className="flex items-center space-x-3 cursor-pointer">
									<input
										type="radio"
										name={`question-${currentQuestion}`}
										checked={selectedAnswers[currentQuestion] === index}
										onChange={() => handleAnswerSelect(currentQuestion, index)}
										className="w-4 h-4 text-emerald-600 bg-neutral-800 border-neutral-600 focus:ring-emerald-500"
									/>
									<span className="text-neutral-300">{option}</span>
								</label>
							))}
						</div>
					</div>

					<div className="flex justify-between">
						<button
							onClick={prevQuestion}
							disabled={currentQuestion === 0}
							className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
						>
							Previous
						</button>

						{isLastQuestion ? (
							<button
								onClick={submitQuiz}
								disabled={!allAnswered}
								className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
							>
								Submit Quiz
							</button>
						) : (
							<button
								onClick={nextQuestion}
								className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
							>
								Next
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

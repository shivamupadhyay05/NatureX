import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
	en: { translation: {
		appName: 'NatureX',
		login: 'Login',
		signup: 'Sign up',
		logout: 'Logout',
		student: 'Student',
		teacher: 'Teacher',
		admin: 'Admin',
		leaderboard: 'Leaderboard',
		lessons: 'Lessons',
		quizzes: 'Quizzes',
		missions: 'Missions',
		rewards: 'Rewards',
		notifications: 'Notifications',
		welcomeHeadline: 'Gamified Environmental Education',
		getStarted: 'Get started',
	}},
	hi: { translation: {
		appName: 'नेचरX',
		login: 'लॉगिन',
		signup: 'साइन अप',
		logout: 'लॉगआउट',
		student: 'विद्यार्थी',
		teacher: 'शिक्षक',
		admin: 'प्रशासक',
		leaderboard: 'लीडरबोर्ड',
		lessons: 'पाठ',
		quizzes: 'क्विज़',
		missions: 'मिशन',
		rewards: 'पुरस्कार',
		notifications: 'सूचनाएँ',
		welcomeHeadline: 'खेल आधारित पर्यावरण शिक्षा',
		getStarted: 'शुरू करें',
	}},
	pa: { translation: {
		appName: 'ਨੇਚਰX',
		login: 'ਲਾਗਇਨ',
		signup: 'ਸਾਇਨ ਅੱਪ',
		logout: 'ਲਾਗਆਉਟ',
		student: 'ਵਿਦਿਆਰਥੀ',
		teacher: 'ਅਧਿਆਪਕ',
		admin: 'ਐਡਮਿਨ',
		leaderboard: 'ਲੀਡਰਬੋਰਡ',
		lessons: 'ਪਾਠ',
		quizzes: 'ਕੁਇਜ਼',
		missions: 'ਮਿਸ਼ਨ',
		rewards: 'ਇਨਾਮ',
		notifications: 'ਸੂਚਨਾਵਾਂ',
		welcomeHeadline: 'ਖੇਡ ਅਧਾਰੀਤ ਪਰੀਆਵਰਣ ਸਿੱਖਿਆ',
		getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
	}},
}

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'en',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
	})

export default i18n

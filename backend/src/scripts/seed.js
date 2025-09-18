require('dotenv').config()
const { connect } = require('../config/db')
const Lesson = require('../models/Lesson')
const Quiz = require('../models/Quiz')
const Mission = require('../models/Mission')

async function main() {
  await connect()

  const lessonsCount = await Lesson.countDocuments()
  if (lessonsCount === 0) {
    await Lesson.insertMany([
      { title: 'Pollution Basics', category: 'pollution', content: 'Intro to pollution...', xp: 100 },
      { title: 'Biodiversity 101', category: 'biodiversity', content: 'Intro to biodiversity...', xp: 120 },
      { title: 'Climate Change', category: 'climate', content: 'Intro to climate change...', xp: 150 },
    ])
    console.log('Seeded lessons')
  }

  const quizzesCount = await Quiz.countDocuments()
  if (quizzesCount === 0) {
    await Quiz.insertMany([
      { title: 'Climate Quiz', category: 'climate', xp: 120, questions: [
        { q: 'What gas is the primary greenhouse gas?', options: ['O2','CO2','N2','H2'], answerIndex: 1 },
        { q: 'What causes global warming?', options: ['Solar radiation','Greenhouse gases','Ocean currents','Wind patterns'], answerIndex: 1 },
        { q: 'Which activity produces the most CO2?', options: ['Transportation','Electricity generation','Agriculture','Industry'], answerIndex: 1 },
      ]},
      { title: 'Waste Management Quiz', category: 'waste', xp: 100, questions: [
        { q: 'Which bin is for paper?', options: ['Green','Blue','Red','Black'], answerIndex: 1 },
        { q: 'What is the 3R principle?', options: ['Reduce, Reuse, Recycle','Read, Write, Remember','Run, Rest, Relax','Red, Green, Blue'], answerIndex: 0 },
        { q: 'How long does plastic take to decompose?', options: ['1 year','10 years','100 years','500+ years'], answerIndex: 3 },
      ]},
    ])
    console.log('Seeded quizzes')
  }

  const missionsCount = await Mission.countDocuments()
  if (missionsCount === 0) {
    await Mission.insertMany([
      { title: 'Plant a Tree', type: 'real-world', description: 'Plant and geo-tag a sapling', xp: 200 },
      { title: 'Segregate Waste at Home', type: 'habit', description: 'Daily segregation for a week', xp: 150 },
    ])
    console.log('Seeded missions')
  }

  console.log('Seeding done')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })


'use client';
import HLSPlayer from '@/app/components/HLSPlayer';

const quizData = [
  {
    time: 4,
    question: 'A is the first letter of the _____.',
    options: ['Alphabet', 'Number', 'Color'],
    correctAnswerIndex: 0,
  },
  {
    time: 8,
    question: 'What color is the sky?',
    options: ['Blue', 'Green', 'Red'],
    correctAnswerIndex: 0,
  },
  {
    time: 12,
    question: 'Which one is an animal?',
    options: ['Cat', 'Car', 'Cup'],
    correctAnswerIndex: 0,
  },
  {
    time: 16,
    question: 'How many legs does a human have?',
    options: ['One', 'Two', 'Three'],
    correctAnswerIndex: 1,
  },
  {
    time: 20,
    question: 'What do you use to eat soup?',
    options: ['Spoon', 'Fork', 'Knife'],
    correctAnswerIndex: 0,
  }
];

export default function VideoPage() {

  const video = 'http://47.128.238.128:8081/media/ForBiggerFun.mp4/playlist.m3u8'

  return (

    <div style={{ textAlign: 'center', padding: '40px 0', backgroundColor: '#f5f5f5' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#2c3e50',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
        marginBottom: '20px',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>Interactive Learning</h1>
      <HLSPlayer
        src={video}
        quizEvents={quizData}
        onQuizAnswered={(event, answerIndex, isCorrect) => {
          console.log(`ตอบ: ${event.options[answerIndex]} (${isCorrect ? 'ถูกต้อง' : 'ผิด'})`);
        }}
      />
    </div>
  )
}

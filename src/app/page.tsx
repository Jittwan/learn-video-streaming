'use client';
import HLSPlayer from '@/app/components/HLSPlayer';

type QuizEvent = {
  time: number;
  question: string;
  options: string[];
  correctAnswerIndex: number[];
  quizType: 'single' | 'multiple';
};

const quizData = [
  {
    time: 4,
    question: 'A is the first letter of the _____.',
    options: ['Alphabet', 'Number', 'Color'],
    correctAnswerIndex: [0],
    quizType: 'single',
  },
  {
    time: 20,
    question: 'What color is the sky?',
    options: ['Blue', 'Green', 'Red'],
    correctAnswerIndex: [0],
    quizType: 'single',
  },
  {
    time: 30,
    question: 'Which one(s) are animals?',
    options: ['Cat', 'Car', 'Dog'],
    correctAnswerIndex: [0, 2],
    quizType: 'multiple',
  },
  {
    time: 40,
    question: 'How many legs does a human have?',
    options: ['One', 'Two', 'Three'],
    correctAnswerIndex: [1],
    quizType: 'single',
  },
  {
    time: 50,
    question: 'Which of the following can you use to eat soup?',
    options: ['Spoon', 'Fork', 'Chopsticks'],
    correctAnswerIndex: [0, 2],
    quizType: 'multiple',
  }
];

export default function VideoPage() {



  const video = 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8'

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
        quizEvents={quizData as unknown as QuizEvent[]}
        onQuizAnswered={(event, answerIndexes, isCorrect) => {
          const selected = answerIndexes.map(i => event.options[i]).join(', ');
          console.log(`ตอบ: ${selected} (${isCorrect ? 'ถูกต้อง' : 'ผิด'})`);
        }}
      />
    </div>
  )
}

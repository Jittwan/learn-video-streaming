'use client';
import HLSPlayer from '@/app/components/HLSPlayer';

const quizData = [
  {
    time: 10,
    question: 'HTML คืออะไร?',
    options: ['ภาษาตัดต่อวิดีโอ', 'ภาษาเขียนเว็บ', 'เครื่องมือวาดภาพ'],
    correctAnswerIndex: 1,
  },
  {
    time: 30,
    question: 'React คืออะไร?',
    options: ['Library JavaScript', 'ระบบปฏิบัติการ', 'เกมมือถือ'],
    correctAnswerIndex: 0,
  }
];

export default function VideoPage() {

  const video = 'http://47.128.238.128:8081/media/ForBiggerFun.mp4/playlist.m3u8'

  return (
    
    <div>
    <h1>Interactive Learning</h1>
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

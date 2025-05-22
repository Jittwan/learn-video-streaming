'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

type QuizEvent = {
  time: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

type HLSPlayerProps = {
  src: string;
  quizEvents: QuizEvent[];
  onQuizAnswered?: (event: QuizEvent, selectedIndex: number, isCorrect: boolean) => void;
};

export default function HLSPlayer({ src, quizEvents, onQuizAnswered }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  const [currentQuiz, setCurrentQuiz] = useState<QuizEvent | null>(null);
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Set<number>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [allowedMaxTime, setAllowedMaxTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      sources: [{ src, type: 'application/x-mpegURL' }],
    });

    playerRef.current = player;

    const savedTime = localStorage.getItem('video-time');
    if (savedTime !== null) {
      const parsedTime = parseFloat(savedTime);
      if (!isNaN(parsedTime)) {
        player.currentTime(parsedTime);
      }
    }

    const saveTime = () => {
      const currentTime = player.currentTime() ?? 0;
      localStorage.setItem('video-time', currentTime.toString());
    };

    player.on('timeupdate', saveTime);

    return () => {
      player.off('timeupdate', saveTime);
      player.dispose();
    };
  }, [src]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const seekBar = (player as any).controlBar?.progressControl?.seekBar;

    if (seekBar) {
      const originalHandleMouseDown = seekBar.handleMouseDown.bind(seekBar);

      seekBar.handleMouseDown = function (event: any) {
        const rawDuration = player.duration();
        if (typeof rawDuration !== 'number' || isNaN(rawDuration)) return;

        const mouseTime = seekBar.calculateDistance(event) * rawDuration;

        if (mouseTime > allowedMaxTime) {
          event.stopPropagation();
          event.preventDefault();
          player.currentTime(allowedMaxTime);
          return;
        }

        originalHandleMouseDown(event);
      };
    }
  }, [allowedMaxTime]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleTimeUpdate = () => {
      const currentTime = player.currentTime() ?? 0;

      if (currentQuiz && currentTime < currentQuiz.time - 1) {
        setCurrentQuiz(null);
      }

      if (!currentQuiz) {
        setAllowedMaxTime(prev => Math.max(prev, currentTime));
      }
    };

    const handleSeeking = () => {
      const currentTime = player.currentTime() ?? 0;
      if (currentTime > allowedMaxTime) {
        player.currentTime(allowedMaxTime);
      }
    };

    player.on('timeupdate', handleTimeUpdate);
    player.on('seeking', handleSeeking);

    return () => {
      player.off('timeupdate', handleTimeUpdate);
      player.off('seeking', handleSeeking);
    };
  }, [allowedMaxTime, currentQuiz]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const checkQuiz = () => {
      const currentTime = player.currentTime() ?? 0;

      quizEvents.forEach((event, index) => {
        if (
          Math.abs(currentTime - event.time) < 1 &&
          !answeredQuizzes.has(index)
        ) {
          setCurrentQuiz(event);
          setSelectedAnswer(null);
          setError(null);
          player.pause();
        }
      });
    };

    player.on('timeupdate', checkQuiz);
    return () => player.off('timeupdate', checkQuiz);
  }, [quizEvents, answeredQuizzes]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const preventPlay = () => {
      if (currentQuiz) {
        player.pause();
        setTimeout(() => player.pause(), 50);
      }
    };

    player.on('play', preventPlay);
    return () => player.off('play', preventPlay);
  }, [currentQuiz]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (currentQuiz && e.code === 'Space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentQuiz]);

  const handleSubmit = () => {
    if (!currentQuiz || selectedAnswer === null) {
      setError('กรุณาเลือกคำตอบ');
      return;
    }

    const quizIndex = quizEvents.findIndex(q => q.time === currentQuiz.time);
    const isCorrect = selectedAnswer === currentQuiz.correctAnswerIndex;

    onQuizAnswered?.(currentQuiz, selectedAnswer, isCorrect);

    if (isCorrect) {
      setAnsweredQuizzes(prev => new Set(prev).add(quizIndex));
      setCurrentQuiz(null);
      setSelectedAnswer(null);
      setError(null);
      playerRef.current?.play();
    } else {
      setError('คำตอบไม่ถูก');
    }
  };

  return (
    <div style={{ position: 'relative', width: 720 }}>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        width="720"
        height="405"
      />
      {currentQuiz && (
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <h3>{currentQuiz.question}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 10 }}>
            {currentQuiz.options.map((option, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="quiz"
                  checked={selectedAnswer === idx}
                  onChange={() => {
                    setSelectedAnswer(idx);
                    setError(null);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
          {error && <div style={{ marginTop: '10px', color: 'salmon' }}>{error}</div>}
          <button
            onClick={handleSubmit}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4caf50',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ส่งคำตอบ
          </button>
        </div>
      )}
    </div>
  );
}

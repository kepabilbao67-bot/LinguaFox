import { useCallback, useMemo, useState } from 'react';

import type { Lesson, Question, Word } from '@/types/learning';

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function createQuestion(word: Word, words: readonly Word[]): Question {
  const distractors = shuffle(
    words.filter((candidate) => candidate.id !== word.id).map((candidate) => candidate.translation),
  ).slice(0, 3);

  return { ...word, options: shuffle([word.translation, ...distractors]) };
}

interface QuizState {
  questions: readonly Question[];
  currentQuestion: Question | undefined;
  questionIndex: number;
  score: number;
  selectedAnswer: string | null;
  isFinished: boolean;
  answer: (option: string) => void;
  next: () => void;
}

export function useQuiz(lesson: Lesson | undefined): QuizState {
  const questions = useMemo<readonly Question[]>(
    () => (lesson ? shuffle(lesson.words).map((word) => createQuestion(word, lesson.words)) : []),
    [lesson],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const currentQuestion = questions[questionIndex];

  const answer = useCallback(
    (option: string) => {
      if (!currentQuestion || selectedAnswer !== null) return;
      setSelectedAnswer(option);
      if (option === currentQuestion.translation) setScore((current) => current + 1);
    },
    [currentQuestion, selectedAnswer],
  );

  const next = useCallback(() => {
    if (!currentQuestion || selectedAnswer === null) return;
    if (questionIndex + 1 >= questions.length) {
      setIsFinished(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  }, [currentQuestion, questionIndex, questions.length, selectedAnswer]);

  return {
    questions,
    currentQuestion,
    questionIndex,
    score,
    selectedAnswer,
    isFinished,
    answer,
    next,
  };
}

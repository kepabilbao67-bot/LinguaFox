import { useCallback, useMemo, useState } from 'react';
import type { Exercise, Lesson, Word } from '@/types/learning';

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export interface QuizItem {
  id: string;
  type: string;
  prompt: string;
  source: string;
  translation: string;
  options: readonly string[];
  audioText?: string;
  explanation?: string;
}

function exerciseToQuizItem(ex: Exercise, lessonWords: readonly Word[]): QuizItem | null {
  if (ex.type === 'multipleChoice') {
    return {
      id: ex.id,
      type: ex.type,
      prompt: ex.prompt || 'Selecciona la traducción correcta',
      source: ex.question,
      translation: ex.answer,
      options: ex.options,
      audioText: ex.audioText ?? ex.question,
    };
  }

  if (ex.type === 'listen') {
    return {
      id: ex.id,
      type: ex.type,
      prompt: ex.prompt || 'Escucha y selecciona lo que oíste',
      source: '🔊 Escucha el audio atentamente',
      translation: ex.answer,
      options: ex.options,
      audioText: ex.audioText,
    };
  }

  if (ex.type === 'fillBlank') {
    return {
      id: ex.id,
      type: ex.type,
      prompt: ex.prompt || 'Completa el espacio en blanco',
      source: ex.sentence,
      translation: ex.answer,
      options: ex.options,
      audioText: ex.audioText,
      explanation: `Traducción: "${ex.translation}"`,
    };
  }

  if (ex.type === 'translate') {
    return {
      id: ex.id,
      type: ex.type,
      prompt: ex.prompt || 'Traduce la frase',
      source: ex.sourceText,
      translation: ex.answerWords.join(' '),
      options: shuffle([
        ex.answerWords.join(' '),
        ...ex.wordBank.filter((w) => !ex.answerWords.includes(w)).slice(0, 3).map((w) => `${w} ...`),
      ]),
      audioText: ex.audioText,
    };
  }

  return null;
}

function createFallbackQuestion(word: Word, words: readonly Word[]): QuizItem {
  const distractors = shuffle(
    words.filter((candidate) => candidate.id !== word.id).map((candidate) => candidate.translation),
  ).slice(0, 3);

  return {
    id: word.id,
    type: 'multipleChoice',
    prompt: '¿Qué significa esta palabra?',
    source: word.source,
    translation: word.translation,
    options: shuffle([word.translation, ...distractors]),
    audioText: word.source,
  };
}

interface QuizState {
  questions: readonly QuizItem[];
  currentQuestion: QuizItem | undefined;
  questionIndex: number;
  score: number;
  selectedAnswer: string | null;
  isFinished: boolean;
  answer: (option: string) => void;
  next: () => void;
}

export function useQuiz(lesson: Lesson | undefined): QuizState {
  const questions = useMemo<readonly QuizItem[]>(() => {
    if (!lesson) return [];

    if (lesson.exercises && lesson.exercises.length > 0) {
      const items: QuizItem[] = [];
      for (const ex of lesson.exercises) {
        const item = exerciseToQuizItem(ex, lesson.words);
        if (item) items.push(item);
      }
      if (items.length > 0) return items;
    }

    return shuffle(lesson.words).map((word) => createFallbackQuestion(word, lesson.words));
  }, [lesson]);

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

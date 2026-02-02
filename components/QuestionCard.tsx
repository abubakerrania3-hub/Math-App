
import React from 'react';
import type { Question, GameState } from '../types';
import AnswerInput from './AnswerInput';

interface QuestionCardProps {
  question: Question | null;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  checkAnswer: () => void;
  gameState: GameState;
  isLoading: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, userAnswer, setUserAnswer, checkAnswer, gameState, isLoading }) => {
  const getBorderColor = () => {
    if (gameState === 'correct') return 'border-green-500';
    if (gameState === 'incorrect') return 'border-red-500';
    return 'border-purple-400';
  };

  if (isLoading) {
    return (
      <div className="bg-white/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg flex justify-center items-center h-64">
        <div className="text-2xl font-bold text-purple-800 animate-pulse">
          جارٍ تحضير السؤال...
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="bg-white/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg text-center">
        <p className="text-xl font-bold text-purple-800">لا يوجد سؤال حالي. ابدأ اللعب!</p>
      </div>
    );
  }
  
  const borderClass = getBorderColor();

  return (
    <div className={`bg-white/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border-4 transition-colors duration-500 ${borderClass}`}>
      <div className="text-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 min-h-[100px] flex items-center justify-center">
          {question.text}
        </p>
      </div>
      <AnswerInput 
        question={question}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        onSubmit={checkAnswer}
        gameState={gameState}
      />
    </div>
  );
};

export default QuestionCard;

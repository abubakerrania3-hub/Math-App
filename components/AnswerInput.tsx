
import React from 'react';
import type { Question, GameState } from '../types';

interface AnswerInputProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onSubmit: () => void;
  gameState: GameState;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ question, userAnswer, setUserAnswer, onSubmit, gameState }) => {
    
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  if (question.options) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => {setUserAnswer(option); setTimeout(onSubmit, 100)}}
            disabled={gameState !== 'playing'}
            className="text-3xl font-bold bg-white/50 text-purple-800 p-4 rounded-xl shadow-md hover:bg-yellow-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-4">
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="اكتب إجابتك هنا"
        disabled={gameState !== 'playing'}
        className="text-center text-2xl font-bold w-full p-4 rounded-xl border-4 border-purple-400 focus:border-yellow-400 focus:ring-yellow-400 text-gray-800 disabled:bg-gray-200"
        dir="ltr"
      />
      <button 
        onClick={onSubmit}
        disabled={gameState !== 'playing'}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg text-2xl transition-transform transform hover:scale-105 disabled:bg-gray-400"
      >
        تأكيد
      </button>
    </div>
  );
};

export default AnswerInput;


import React from 'react';
import type { Difficulty } from '../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const difficulties: { id: Difficulty; label: string; color: string }[] = [
  { id: 'easy', label: 'سهل', color: 'bg-green-500 hover:bg-green-600' },
  { id: 'medium', label: 'متوسط', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 'hard', label: 'صعب', color: 'bg-red-500 hover:bg-red-600' },
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentDifficulty, onSelectDifficulty }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-3">مستوى الصعوبة</h3>
      <div className="flex justify-around gap-2">
        {difficulties.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => onSelectDifficulty(id)}
            className={`w-full font-bold py-2 px-3 rounded-lg text-white shadow-md transition-all transform hover:scale-105 ${color} ${
              currentDifficulty === id ? 'ring-4 ring-white' : ''
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;

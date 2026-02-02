
import React from 'react';

interface StatsProps {
  score: number;
  correct: number;
  incorrect: number;
}

const Stats: React.FC<StatsProps> = ({ score, correct, incorrect }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg text-gray-800">
      <div className="text-center mb-3">
        <span className="text-lg font-bold">النقاط</span>
        <p className="text-5xl font-bold text-purple-700">{score}</p>
      </div>
      <div className="flex justify-around text-center">
        <div>
          <span className="text-lg font-semibold">صحيحة ✅</span>
          <p className="text-2xl font-bold text-green-700">{correct}</p>
        </div>
        <div>
          <span className="text-lg font-semibold">خاطئة ❌</span>
          <p className="text-2xl font-bold text-red-700">{incorrect}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;

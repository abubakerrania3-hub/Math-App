
import React from 'react';
import type { Badge } from '../types';

interface BadgeDisplayProps {
  badges: Badge[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-3">🏅 أوسمتي 🏅</h3>
      {badges.length === 0 ? (
        <p className="text-center text-gray-600">لم تحصل على أوسمة بعد. استمر باللعب!</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <div key={badge.name} title={badge.name} className="bg-yellow-400/50 p-2 rounded-full text-3xl shadow-md transition-transform transform hover:scale-110">
              {badge.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;

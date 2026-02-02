
import React from 'react';

interface AITutorProps {
  icon: 'happy' | 'thinking' | 'sad' | 'idea';
  message: string;
}

const ICONS: Record<AITutorProps['icon'], string> = {
    happy: '😊',
    thinking: '🤔',
    sad: '😟',
    idea: '💡'
};

const AITutor: React.FC<AITutorProps> = ({ icon, message }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg flex items-center gap-4">
      <div className="text-6xl animate-bounce">{ICONS[icon]}</div>
      <div className="text-right flex-1">
        <p className="text-lg font-bold text-gray-800">المعلم الذكي</p>
        <p className="text-md text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default AITutor;

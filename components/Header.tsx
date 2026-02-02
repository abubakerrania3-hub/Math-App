
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-shadow" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
        🚀 مغامرات الرياضيات الذكية 🧠
      </h1>
      <p className="text-lg sm:text-xl text-white/90 mt-2">تعلم الأرقام بمتعة وتشويق!</p>
    </header>
  );
};

export default Header;

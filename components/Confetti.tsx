import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  // FIX: The `JSX` namespace was not found. Using `React.ReactElement` is a safer alternative that is available through the `React` import.
  const [pieces, setPieces] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }).map((_, i) => {
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 3}s`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        transform: `rotate(${Math.random() * 360}deg)`
      };
      return <div key={i} className="confetti" style={style}></div>;
    });
    setPieces(newPieces);
  }, []);

  return <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">{pieces}</div>;
};

export default Confetti;
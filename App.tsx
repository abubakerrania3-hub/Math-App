
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Question, Difficulty, Badge, GameState } from './types';
import { QuestionType } from './types';
import { generateQuestion } from './services/questionGenerator';
import { getHint, generateStoryProblem } from './services/geminiService';
import { BADGES, CORRECT_MESSAGES, INCORRECT_MESSAGES } from './constants';
import Header from './components/Header';
import Stats from './components/Stats';
import DifficultySelector from './components/DifficultySelector';
import QuestionCard from './components/QuestionCard';
import AITutor from './components/AITutor';
import BadgeDisplay from './components/BadgeDisplay';
import Confetti from './components/Confetti';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
    const [difficulty, setDifficulty] = useLocalStorage<Difficulty>('math_difficulty', 'easy');
    const [score, setScore] = useLocalStorage<number>('math_score', 0);
    const [correctAnswers, setCorrectAnswers] = useLocalStorage<number>('math_correct', 0);
    const [incorrectAnswers, setIncorrectAnswers] = useLocalStorage<number>('math_incorrect', 0);
    const [earnedBadges, setEarnedBadges] = useLocalStorage<Badge[]>('math_badges', []);
    
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [lastQuestionType, setLastQuestionType] = useState<QuestionType | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [gameState, setGameState] = useState<GameState>('playing');
    const [feedback, setFeedback] = useState<string>('أهلاً بك في مغامرات الرياضيات! اختر مستوى الصعوبة للبدء.');
    const [tutorIcon, setTutorIcon] = useState<'happy' | 'thinking' | 'sad' | 'idea'>('happy');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    const startNewGame = useCallback((level: Difficulty) => {
        setDifficulty(level);
        setScore(0);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        setEarnedBadges([]);
        setFeedback('هيا بنا نبدأ! بالتوفيق يا بطل.');
        fetchNewQuestion(level, null);
    }, []);

    const fetchNewQuestion = useCallback(async (level: Difficulty, lastType: QuestionType | null) => {
        setIsLoading(true);
        setGameState('playing');
        setTutorIcon('thinking');
        setUserAnswer('');
        setFeedback(' أفكر في سؤال جديد لك...');
        
        let question: Question;
        if (process.env.API_KEY && (level === 'hard' || Math.random() < 0.3)) {
             try {
                // Occasionally use Gemini for story problems to add variety
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                question = await generateStoryProblem(ai, level);
             } catch (e) {
                console.error("AI question generation failed, falling back to local generator.", e);
                question = generateQuestion(level, lastType);
             }
        } else {
            question = generateQuestion(level, lastType);
        }

        setCurrentQuestion(question);
        setLastQuestionType(question.type);
        setFeedback('ما هو الحل الصحيح يا ترى؟');
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!currentQuestion) {
            fetchNewQuestion(difficulty, null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAnswer = () => {
        if (!currentQuestion) return;

        const isCorrect = userAnswer.trim() === String(currentQuestion.answer);

        if (isCorrect) {
            const newScore = score + 10;
            const newCorrect = correctAnswers + 1;
            setScore(newScore);
            setCorrectAnswers(newCorrect);
            setFeedback(CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)]);
            setTutorIcon('happy');
            setGameState('correct');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);

            const newBadge = BADGES.find(b => b.milestone === newCorrect && !earnedBadges.some(eb => eb.name === b.name));
            if (newBadge) {
                setEarnedBadges([...earnedBadges, newBadge]);
                setFeedback(`رائع! لقد حصلت على وسام جديد: ${newBadge.name}!`);
            }
        } else {
            setIncorrectAnswers(incorrectAnswers + 1);
            setFeedback(INCORRECT_MESSAGES[Math.floor(Math.random() * INCORRECT_MESSAGES.length)]);
            setTutorIcon('sad');
            setGameState('incorrect');
        }
    };
    
    const handleNextQuestion = () => {
        fetchNewQuestion(difficulty, lastQuestionType);
    };

    const handleHint = async () => {
        if (!currentQuestion || !process.env.API_KEY) {
            setFeedback('عذراً، لا يمكنني إعطاء تلميح الآن.');
            return;
        }
        setIsLoading(true);
        setTutorIcon('idea');
        setFeedback('دعني أرى، ما المساعدة التي يمكنني تقديمها...');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const hint = await getHint(ai, currentQuestion);
            setFeedback(`تلميح: ${hint}`);
        } catch (error) {
            console.error("Error getting hint:", error);
            setFeedback('أوه! حدث خطأ ما أثناء محاولة الحصول على تلميح.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-purple-500 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            {showConfetti && <Confetti />}
            <div className="w-full max-w-4xl mx-auto">
                <Header />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    <aside className="lg:col-span-1 flex flex-col gap-6">
                        <Stats score={score} correct={correctAnswers} incorrect={incorrectAnswers} />
                        <DifficultySelector currentDifficulty={difficulty} onSelectDifficulty={startNewGame} />
                        <BadgeDisplay badges={earnedBadges} />
                    </aside>

                    <main className="lg:col-span-2 flex flex-col gap-6">
                        <QuestionCard 
                            question={currentQuestion}
                            userAnswer={userAnswer}
                            setUserAnswer={setUserAnswer}
                            checkAnswer={checkAnswer}
                            gameState={gameState}
                            isLoading={isLoading}
                        />
                         <AITutor icon={tutorIcon} message={feedback} />
                         <div className="flex items-center justify-center gap-4">
                            <button onClick={handleNextQuestion} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400" disabled={isLoading}>
                                سؤال جديد
                            </button>
                            <button onClick={handleHint} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400" disabled={isLoading || !process.env.API_KEY}>
                                تلميح ✨
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;

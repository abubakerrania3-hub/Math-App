
import type { Question, Difficulty } from '../types';
import { QuestionType } from '../types';
import { ARABIC_NAMES, ARABIC_ITEMS_PLURAL } from '../constants';

const getRandomNumber = (difficulty: Difficulty): number => {
    if (difficulty === 'easy') return Math.floor(Math.random() * 10) + 1;
    if (difficulty === 'medium') return Math.floor(Math.random() * 15) + 1;
    return Math.floor(Math.random() * 20) + 1;
};

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

// Available question generator functions
const generators: ((difficulty: Difficulty) => Question)[] = [
    generateAdditionQuestion,
    generateSubtractionQuestion,
    generateComparisonQuestion,
    generateMultipleChoiceAddition,
    generateStoryProblemAddition,
    generateFillInBlankAddition,
    generateOrderingQuestion,
    generateSequenceQuestion,
];

export const generateQuestion = (difficulty: Difficulty, lastQuestionType: QuestionType | null): Question => {
    let newQuestion: Question;
    let attempts = 0;
    
    // Try to generate a different type of question than the last one
    do {
        const randomIndex = Math.floor(Math.random() * generators.length);
        newQuestion = generators[randomIndex](difficulty);
        attempts++;
    } while (newQuestion.type === lastQuestionType && attempts < 5);

    return newQuestion;
};

function generateAdditionQuestion(difficulty: Difficulty): Question {
    const num1 = getRandomNumber(difficulty);
    const num2 = getRandomNumber(difficulty);
    return {
        type: QuestionType.ADDITION,
        text: `ما هو ناتج جمع ${num1} + ${num2}؟`,
        answer: num1 + num2,
    };
}

function generateSubtractionQuestion(difficulty: Difficulty): Question {
    let num1 = getRandomNumber(difficulty);
    let num2 = getRandomNumber(difficulty);
    if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure result is not negative
    return {
        type: QuestionType.SUBTRACTION,
        text: `ما هو ناتج طرح ${num1} - ${num2}؟`,
        answer: num1 - num2,
    };
}

function generateComparisonQuestion(difficulty: Difficulty): Question {
    const num1 = getRandomNumber(difficulty);
    const num2 = getRandomNumber(difficulty);
    let answer: string;
    if (num1 > num2) answer = '>';
    else if (num1 < num2) answer = '<';
    else answer = '=';
    return {
        type: QuestionType.COMPARISON,
        text: `ضع الرمز المناسب ( > أو < أو = ) بين العددين: ${num1} ___ ${num2}`,
        options: ['<', '>', '='],
        answer: answer,
    };
}

function generateMultipleChoiceAddition(difficulty: Difficulty): Question {
    const num1 = getRandomNumber(difficulty);
    const num2 = getRandomNumber(difficulty);
    const correctAnswer = num1 + num2;
    const options = new Set<string>();
    options.add(String(correctAnswer));
    while (options.size < 4) {
        const wrongAnswer = correctAnswer + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (wrongAnswer >= 0 && wrongAnswer !== correctAnswer) {
            options.add(String(wrongAnswer));
        }
    }
    return {
        type: QuestionType.MULTIPLE_CHOICE_ADDITION,
        text: `اختر الإجابة الصحيحة: ${num1} + ${num2} = ؟`,
        options: shuffleArray(Array.from(options)),
        answer: String(correctAnswer),
    };
}

function generateStoryProblemAddition(difficulty: Difficulty): Question {
    const name = ARABIC_NAMES[Math.floor(Math.random() * ARABIC_NAMES.length)];
    const item = ARABIC_ITEMS_PLURAL[Math.floor(Math.random() * ARABIC_ITEMS_PLURAL.length)];
    const num1 = getRandomNumber(difficulty);
    const num2 = getRandomNumber(difficulty);
    return {
        type: QuestionType.STORY_PROBLEM_ADDITION,
        text: `مع ${name} ${num1} ${item}، وأعطاه صديقه ${num2} ${item} أخرى. كم عدد الـ${item} التي أصبحت مع ${name} الآن؟`,
        answer: num1 + num2,
    };
}


function generateFillInBlankAddition(difficulty: Difficulty): Question {
    const num1 = getRandomNumber(difficulty);
    const num2 = getRandomNumber(difficulty);
    const sum = num1 + num2;
    return {
        type: QuestionType.FILL_IN_BLANK_ADDITION,
        text: `أكمل الفراغ: ${num1} + ___ = ${sum}`,
        answer: num2,
    };
}

function generateOrderingQuestion(difficulty: Difficulty): Question {
    const numbers = new Set<number>();
    const count = difficulty === 'easy' ? 3 : 4;
    while (numbers.size < count) {
        numbers.add(getRandomNumber(difficulty));
    }
    const shuffled = shuffleArray(Array.from(numbers));
    const sorted = [...shuffled].sort((a, b) => a - b);
    return {
        type: QuestionType.ORDERING,
        text: `رتب الأعداد التالية من الأصغر إلى الأكبر، وافصل بينها بمسافة: ${shuffled.join(' ، ')}`,
        answer: sorted.join(' '),
    };
}

function generateSequenceQuestion(difficulty: Difficulty): Question {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = Math.floor(Math.random() * 3) + 1;
    const sequence = [start, start + step, '___', start + (step * 3)];
    return {
        type: QuestionType.SEQUENCE,
        text: `أوجد العدد المفقود في السلسلة التالية: ${sequence.join(' ، ')}`,
        answer: start + (step * 2),
    };
}

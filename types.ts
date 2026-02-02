
export enum QuestionType {
  ADDITION,
  SUBTRACTION,
  COMPARISON,
  MULTIPLE_CHOICE_ADDITION,
  STORY_PROBLEM_ADDITION,
  STORY_PROBLEM_SUBTRACTION,
  FILL_IN_BLANK_ADDITION,
  ORDERING,
  SEQUENCE,
  AI_STORY,
}

export interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  answer: string | number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Badge {
  name: string;
  icon: string;
  milestone: number;
}

export type GameState = 'playing' | 'correct' | 'incorrect';

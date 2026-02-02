
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Question, Difficulty } from '../types';
import { QuestionType } from '../types';

export const getHint = async (ai: GoogleGenAI, question: Question): Promise<string> => {
    const prompt = `أعط تلميحًا بسيطًا جدًا من جملة واحدة لطفل لحل مسألة الرياضيات التالية باللغة العربية. لا تعطي الإجابة النهائية. المسألة هي: "${question.text}"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        
        const text = response.text;
        if (text) {
            return text.trim();
        }
        throw new Error("No text response from Gemini for hint.");
    } catch (error) {
        console.error("Gemini hint generation error:", error);
        return "حاول عدّ الأشياء بأصابعك!";
    }
};

export const generateStoryProblem = async (ai: GoogleGenAI, difficulty: Difficulty): Promise<Question> => {
    const numberRange = difficulty === 'easy' ? 10 : (difficulty === 'medium' ? 15 : 20);
    const prompt = `أنشئ مسألة قصة رياضية قصيرة وبسيطة جدًا باللغة العربية لطفل عمره 6 سنوات. يجب أن تكون المسألة عن الجمع أو الطرح، باستخدام أرقام بين 1 و ${numberRange} فقط. يجب أن تكون الإجابة النهائية رقمًا موجبًا. أرجع الرد ككائن JSON صالح فقط بدون أي نص آخر أو علامات كود، وبه المفاتيح التالية: "problem" (تحتوي على نص المسألة)، و"answer" (تحتوي على الإجابة الرقمية).`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        
        const text = response.text;
        if (!text) {
            throw new Error("Empty response from Gemini.");
        }

        // Clean the response to ensure it's valid JSON
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.problem && typeof parsed.answer === 'number') {
            return {
                type: QuestionType.AI_STORY,
                text: parsed.problem,
                answer: parsed.answer,
            };
        } else {
            throw new Error("Invalid JSON structure from Gemini.");
        }

    } catch (error) {
        console.error("Gemini story problem generation error:", error);
        // Fallback to a simple, non-AI question
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return {
            type: QuestionType.ADDITION,
            text: `ما هو حاصل جمع ${num1} + ${num2}؟`,
            answer: num1 + num2,
        };
    }
};

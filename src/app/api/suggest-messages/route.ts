// app/api/gemini-questions/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "edge";

// const genAI = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY!,
// });

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET(req: Request) {
    try {
        const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string. 
Each question should be separated by '||'. These questions are for an anonymous social 
messaging platform, like Qooh.me, and should be suitable for a diverse audience. 
Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. 
For example, your output should be structured like this: 
"What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?". 
Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
    `;


        // we are not using user message we are generating random message based on prompt

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });;
        const text = result.text;

        return NextResponse.json(
            {
                success: true,
                questions: text,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while generating questions.",
            },
            { status: 500 }
        );
    }
}

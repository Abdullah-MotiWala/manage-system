import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { todos } = await request.json();

        const response = await openai.chat.completions.create({
            messages: [
                { role: "user", content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(todos)}` },
                { role: "system", content: "When responding, welcome the user always as Mr. Sonny and say welcome to the Amazing Todo App! Limit the response to 200 characters" }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.8,
            max_tokens: 200,
            stop: "\n", // Ensure that the response is limited to one sentence
        });

        const generatedMessage = response.choices[0].message.content;

        return NextResponse.json({
            message: generatedMessage,
        });
    } catch (error) {
        console.error("Error generating chat completion:", error);
        return NextResponse.error();
    }
}

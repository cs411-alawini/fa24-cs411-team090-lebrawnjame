import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY, // Ensure you set this in your environment variables
  apiKey: "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"
});

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Use the appropriate model
      messages: [
        { role: 'system', content: context },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      max_tokens: 200, // Adjust as needed
    });

    const chatGPTResponse = response.choices[0]?.message?.content;

    return NextResponse.json({ response: chatGPTResponse });
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    return NextResponse.json({ error: 'Failed to get response from ChatGPT' }, { status: 500 });
  }
}
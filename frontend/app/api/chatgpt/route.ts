import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  // apiKey: "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"
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
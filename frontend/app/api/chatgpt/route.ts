import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
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
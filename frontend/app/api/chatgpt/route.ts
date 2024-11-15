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
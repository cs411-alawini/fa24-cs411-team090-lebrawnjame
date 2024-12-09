import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userMessage, queries, context } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: context },
        {
          role: 'user',
          content: `User message: "${userMessage}". Match it with one of these queries: ${queries.join(', ')}`,
        },
      ],
      max_tokens: 200,
    });

    const matchedQuery = response.choices[0]?.message?.content;

    return NextResponse.json({ matchedQuery });
  } catch (error) {
    console.error('Error fetching ChatGPT response for matchQuery:', error);
    return NextResponse.json({ error: 'Failed to match query' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { queryResults, context } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: context },
        {
          role: 'user',
          content: `Summarize these query results: ${JSON.stringify(queryResults)}`,
        },
      ],
      max_tokens: 200,
    });

    const summary = response.choices[0]?.message?.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error fetching ChatGPT response for summarizeResults:', error);
    return NextResponse.json({ error: 'Failed to summarize results' }, { status: 500 });
  }
}

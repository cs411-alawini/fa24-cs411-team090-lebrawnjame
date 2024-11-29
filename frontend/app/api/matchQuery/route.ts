import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userMessage, schema, context } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: context },
        {
          role: 'user',
          content: `User message: "${userMessage}".`,
        },
      ],
      max_tokens: 300,
    });

    const output = response.choices[0]?.message?.content?.trim();

    if (!output) {
      return NextResponse.json(
        { error: 'No valid response received from GPT.' },
        { status: 500 }
      );
    }

    const isSQLQuery = output.toLowerCase().startsWith('select') || 
                       output.toLowerCase().startsWith('insert') || 
                       output.toLowerCase().startsWith('update') || 
                       output.toLowerCase().startsWith('delete');

    if (isSQLQuery) {
      return NextResponse.json({ matchedQuery: output });
    } else {
      return NextResponse.json({ message: output });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
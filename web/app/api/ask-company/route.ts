import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import companyRag from '@/lib/company_rag.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userQuestion = body.question || '';

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are QuickFix Plumbing's AI assistant.

COMPLETE COMPANY KNOWLEDGE:
${JSON.stringify(companyRag, null, 2)}

Answer questions about services, pricing, availability using ONLY this information.`,
        },
        {
          role: 'user',
          content: userQuestion,
        },
      ],
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
      source: 'company_rag',
    });
  } catch (error) {
    console.error('Error in ask-company:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to query company knowledge' },
      { status: 500 }
    );
  }
}


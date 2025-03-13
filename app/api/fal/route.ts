import { NextResponse } from 'next/server';
import * as fal from '@fal-ai/client';

// Konfigurieren Sie den Fal-Client mit dem serverseitigen API-Schlüssel
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelId, input } = body;

    if (!modelId || !input) {
      return NextResponse.json(
        { error: 'modelId and input are required' },
        { status: 400 }
      );
    }

    // Rufen Sie das Fal-Modell auf
    const result = await fal.run(modelId, input);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Fal API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 
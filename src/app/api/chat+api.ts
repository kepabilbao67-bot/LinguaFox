

const SYSTEM_PROMPT = `You are "El Trepamuros" 🕸️, a friendly, agile, and optimistic English tutor.
You are talking to a student learning English.
Your difficulty level is EASY (A1-A2 CEFR).
Vocabulary focus: Routines, city life, and adventures.
Reply style: Use short sentences, encourage the student, and make generic references to climbing or adventures.

INSTRUCTIONS:
1. Always respond in English, using simple vocabulary.
2. If the user makes a grammatical or spelling mistake in their LAST message, provide a correction.
3. The correction explanation should be in Spanish to help the student understand.
4. Always provide 3 short suggestions for what the user could say next (in English).
5. Keep your 'text' response under 40 words.
6. Do NOT break character.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json({ error: 'Invalid or empty messages array' }, { status: 400 });
    }

    const messages = body.messages;

    if (messages.length > 10) {
      return Response.json({ error: 'Too many messages (max 10)' }, { status: 400 });
    }

    const openAiMessages = [{ role: 'system', content: SYSTEM_PROMPT }];

    for (const m of messages) {
      if (typeof m !== 'object' || m === null) {
        return Response.json({ error: 'Invalid message format' }, { status: 400 });
      }
      
      const keys = Object.keys(m);
      if (keys.length !== 2 || !keys.includes('role') || !keys.includes('text')) {
        return Response.json({ error: 'Message must contain exactly role and text' }, { status: 400 });
      }

      if (m.role !== 'user' && m.role !== 'assistant') {
        return Response.json({ error: 'Invalid role. Must be user or assistant' }, { status: 400 });
      }

      if (typeof m.text !== 'string' || m.text.trim() === '' || m.text.length > 2000) {
        return Response.json({ error: 'Invalid text length (1-2000)' }, { status: 400 });
      }

      openAiMessages.push({
        role: m.role,
        content: m.text,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'Tutor not configured' }, { status: 503 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAiMessages,
        temperature: 0.7,
        max_tokens: 200,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'tutor_reply',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                suggestions: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '3 short suggestions for the user to reply.',
                },
                correction: {
                  type: ['object', 'null'],
                  properties: {
                    correctedText: { type: 'string' },
                    explanation: { type: 'string' },
                  },
                  required: ['correctedText', 'explanation'],
                  additionalProperties: false,
                },
              },
              required: ['text', 'suggestions', 'correction'],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      return Response.json({ error: 'Provider Error' }, { status: 502 });
    }

    let parsed;
    try {
      const data = await response.json();
      const replyJson = data.choices[0].message.content;
      parsed = JSON.parse(replyJson);
    } catch {
      return new Response(JSON.stringify({ error: 'JSON malformado' }), { status: 502 });
    }

    return Response.json({
      text: parsed.text,
      correction: parsed.correction,
      suggestions: parsed.suggestions,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error interno del simulador' }), { status: 400 });
  }
}
